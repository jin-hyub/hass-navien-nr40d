"""Navien NR-40D local integration."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers.typing import ConfigType

from .const import CONF_PORTS, DEFAULT_PORTS, DOMAIN
from .coordinator import NavienCoordinator
from .frontend import async_register_frontend
from .protocol import parse_ports

PLATFORMS = (
    Platform.BINARY_SENSOR,
    Platform.CLIMATE,
    Platform.NUMBER,
    Platform.SELECT,
    Platform.SENSOR,
    Platform.SWITCH,
)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    await async_register_frontend(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    await async_register_frontend(hass)
    coordinator = NavienCoordinator(hass, entry)
    try:
        parse_ports(entry.options.get(CONF_PORTS, entry.data.get(CONF_PORTS, DEFAULT_PORTS)))
        await coordinator.async_setup()
    except OSError as err:
        raise ConfigEntryNotReady(f"Cannot listen for the NR-40D: {err}") from err
    except ValueError as err:
        raise ConfigEntryNotReady(str(err)) from err

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if not unload_ok:
        return False
    coordinator: NavienCoordinator = hass.data[DOMAIN].pop(entry.entry_id)
    await coordinator.async_shutdown()
    return unload_ok


async def _async_reload(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)
