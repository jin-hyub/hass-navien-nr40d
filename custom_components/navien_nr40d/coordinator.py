"""Local TCP server that the NR-40D room controller connects to."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_NAME
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import CONNECTION_NETWORK_MAC, DeviceInfo
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import (
    ACK_PAYLOADS,
    CMD_CONTROL,
    CMD_DEVICE_INFO,
    CMD_DEVICE_INFO_REPLY,
    CMD_KEEPALIVE,
    CMD_QUERY,
    CMD_REGISTER,
    CMD_STATUS_REPLY,
    CONF_POLL_INTERVAL,
    CONF_PORTS,
    DEFAULT_HOST,
    DEFAULT_NAME,
    DEFAULT_POLL_INTERVAL,
    DEFAULT_PORTS,
    DOMAIN,
    DST_REMOTE,
    MODE_GOOUT_OFF,
    MODE_GOOUT_ON,
    MODE_INSIDE_HEAT,
    MODE_ONDOL_HEAT,
    MODE_POWER_OFF,
    MODE_POWER_ON,
    MODE_WATER_SET_TEMP,
    SRC_APP,
    SRC_SERVER,
)
from .protocol import (
    DeviceCaps,
    Frame,
    FrameParser,
    NavienData,
    decode_device,
    decode_status,
    parse_ports,
    time_payload,
    whole_degrees,
)

_LOGGER = logging.getLogger(__name__)


class NavienCoordinator(DataUpdateCoordinator[NavienData]):
    """Accept the room controller, keep local state, and send control frames."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        super().__init__(hass, _LOGGER, name=entry.title, update_interval=None)
        self.entry = entry
        self.data = NavienData()
        self._servers: list[asyncio.AbstractServer] = []
        self._writer: asyncio.StreamWriter | None = None
        self._poll_task: asyncio.Task[None] | None = None
        self._query_task: asyncio.Task[None] | None = None
        self._gw: bytes | None = None
        self._proto = 1

    @property
    def _host(self) -> str:
        return self.entry.options.get(CONF_HOST, self.entry.data.get(CONF_HOST, DEFAULT_HOST))

    @property
    def _ports(self) -> list[int]:
        raw = self.entry.options.get(CONF_PORTS, self.entry.data.get(CONF_PORTS, DEFAULT_PORTS))
        return parse_ports(raw)

    @property
    def _poll_interval(self) -> int:
        return int(
            self.entry.options.get(
                CONF_POLL_INTERVAL,
                self.entry.data.get(CONF_POLL_INTERVAL, DEFAULT_POLL_INTERVAL),
            )
        )

    @property
    def device_info(self) -> DeviceInfo:
        gateway = self.data.gateway_id or ""
        connections: set[tuple[str, str]] = set()
        if len(gateway) >= 12:
            mac = ":".join(gateway[index : index + 2] for index in range(0, 12, 2))
            connections.add((CONNECTION_NETWORK_MAC, mac))
        device = self.data.device
        sw_version = f"{device.main_ver}.{device.main_sub_ver}" if device else None
        return DeviceInfo(
            identifiers={(DOMAIN, self.entry.entry_id)},
            connections=connections,
            manufacturer="KD Navien",
            model="NR-40D",
            name=self.entry.data.get(CONF_NAME, DEFAULT_NAME),
            sw_version=sw_version,
        )

    async def async_setup(self) -> None:
        host = self._host
        for port in self._ports:
            server = await asyncio.start_server(self._accept, host, port)
            self._servers.append(server)
            _LOGGER.info("Listening for NR-40D on %s:%s", host, port)
        self.async_set_updated_data(self.data)
        self._poll_task = self.entry.async_create_background_task(
            self.hass, self._poll_loop(), "navien-nr40d-poll"
        )

    async def async_shutdown(self) -> None:
        if self._poll_task:
            self._poll_task.cancel()
            self._poll_task = None
        if self._query_task:
            self._query_task.cancel()
            self._query_task = None
        writer = self._writer
        self._writer = None
        if writer:
            writer.close()
            try:
                await writer.wait_closed()
            except Exception:  # noqa: BLE001
                pass
        for server in self._servers:
            server.close()
            await server.wait_closed()
        self._servers.clear()

    async def _poll_loop(self) -> None:
        polls = 0
        try:
            while True:
                await asyncio.sleep(self._poll_interval)
                if self._writer and self._gw:
                    await self.async_query()
                    polls += 1
                    # Plugging in the boiler's outdoor sensor flips a capability flag.
                    if polls % 10 == 0:
                        await self._send(CMD_DEVICE_INFO)
        except asyncio.CancelledError:
            return

    async def _accept(
        self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter
    ) -> None:
        peer = writer.get_extra_info("peername")
        peer_text = f"{peer[0]}:{peer[1]}" if peer else "unknown"
        if self._writer:
            self._writer.close()
        self._writer = writer
        self._set_data(connected=True, peer=peer_text)
        _LOGGER.info("NR-40D connected from %s", peer_text)
        parser = FrameParser()
        try:
            while True:
                chunk = await reader.read(4096)
                if not chunk:
                    break
                frames, _junk = parser.feed(chunk)
                for frame in frames:
                    if not frame.crc_ok:
                        _LOGGER.warning("Dropped frame with bad CRC: %s", frame)
                        continue
                    self._gw = frame.gw
                    self._proto = frame.proto
                    await self._handle_frame(frame)
        except asyncio.CancelledError:
            raise
        except Exception as err:  # noqa: BLE001
            _LOGGER.info("NR-40D connection from %s closed: %s", peer_text, err)
        finally:
            if self._writer is writer:
                self._writer = None
                self._set_data(connected=False, peer=None)
            writer.close()
            try:
                await writer.wait_closed()
            except Exception:  # noqa: BLE001
                pass
            _LOGGER.info("NR-40D disconnected (%s)", peer_text)

    async def _handle_frame(self, frame: Frame) -> None:
        _LOGGER.debug("RX %s", frame)
        if frame.cmd == CMD_KEEPALIVE:
            await self._send(0x65, time_payload(), SRC_SERVER)
            if not self.data.device:
                await self._send(CMD_DEVICE_INFO)
            return
        if frame.cmd in ACK_PAYLOADS:
            await self._send(frame.cmd + 0x64, ACK_PAYLOADS[frame.cmd], SRC_SERVER)
        else:
            await self._send((frame.cmd + 0x64) & 0xFF, b"\x01", SRC_SERVER)

        if frame.cmd == CMD_REGISTER:
            self.hass.loop.call_later(
                2, lambda: self.hass.async_create_task(self.async_query())
            )
            self.hass.loop.call_later(
                5, lambda: self.hass.async_create_task(self._send(CMD_DEVICE_INFO))
            )
        elif frame.cmd == CMD_DEVICE_INFO_REPLY:
            self._set_data(device=decode_device(frame.data), gateway_id=frame.gw.hex())
        elif frame.cmd == CMD_STATUS_REPLY and frame.data[:1] == b"\x01":
            self._set_data(status=decode_status(frame.data), gateway_id=frame.gw.hex())

    def _set_data(self, **changes: Any) -> None:
        current = self.data
        self.async_set_updated_data(
            NavienData(
                connected=changes.get("connected", current.connected),
                peer=changes.get("peer", current.peer),
                gateway_id=changes.get("gateway_id", current.gateway_id),
                device=changes.get("device", current.device),
                status=changes.get("status", current.status),
            )
        )

    async def _send(self, cmd: int, data: bytes = b"", src: int = SRC_APP) -> None:
        if not self._gw:
            _LOGGER.debug("No gateway id yet, dropping cmd 0x%02x", cmd)
            return
        await self._send_raw(Frame(src, DST_REMOTE, self._proto, self._gw, cmd, data).encode())

    async def _send_raw(self, packet: bytes) -> None:
        writer = self._writer
        if writer is None:
            _LOGGER.debug("Controller is not connected, dropping %s", packet.hex())
            return
        writer.write(packet)
        await writer.drain()
        _LOGGER.debug("TX %s", packet.hex(" "))

    async def async_query(self) -> None:
        await self._send(CMD_QUERY, b"\x00")

    async def async_control(self, mode: int, value: int | None = None) -> None:
        payload = bytes([mode]) if value is None else bytes([mode, value])
        await self._send(CMD_CONTROL, payload)
        if self._query_task:
            self._query_task.cancel()
        self._query_task = self.hass.async_create_task(self._query_later())

    async def _query_later(self) -> None:
        try:
            await asyncio.sleep(3)
            await self.async_query()
        except asyncio.CancelledError:
            return

    async def async_set_power(self, on: bool) -> None:
        await self.async_control(MODE_POWER_ON if on else MODE_POWER_OFF)

    async def async_set_away(self, on: bool) -> None:
        await self.async_control(MODE_GOOUT_ON if on else MODE_GOOUT_OFF)

    async def async_set_room_temp(self, temperature: float) -> None:
        await self.async_control(MODE_INSIDE_HEAT, whole_degrees(temperature))

    async def async_set_water_temp(self, temperature: float) -> None:
        await self.async_control(MODE_ONDOL_HEAT, whole_degrees(temperature))

    async def async_set_dhw_temp(self, temperature: float) -> None:
        await self.async_control(MODE_WATER_SET_TEMP, whole_degrees(temperature))

    async def async_set_heating_mode(self, mode: str) -> None:
        status = self.data.status
        if mode == "room":
            target = status.room_target if status else 21
            await self.async_set_room_temp(target)
        elif mode == "water":
            target = status.water_target if status else 50
            await self.async_set_water_temp(target)
        elif mode == "away":
            # Korean Smart 2.10.1 uses goout-on (mode 4), also exposed by the switch.
            await self.async_set_away(True)
