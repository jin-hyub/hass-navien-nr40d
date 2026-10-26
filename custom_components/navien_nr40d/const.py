"""Constants for the Navien NR-40D integration."""

from __future__ import annotations

DOMAIN = "navien_nr40d"
VERSION = "0.3.6"
DEFAULT_NAME = "Navien NR-40D"
DEFAULT_HOST = "0.0.0.0"
DEFAULT_PORTS = "7000,21001,21002,21003"
DEFAULT_POLL_INTERVAL = 60

CONF_PORTS = "ports"
CONF_POLL_INTERVAL = "poll_interval"

SRC_SERVER = 1
SRC_APP = 2
DST_REMOTE = 3

CMD_KEEPALIVE = 0x01
CMD_REGISTER = 0x02
CMD_DEVICE_INFO_REPLY = 0x05
CMD_STATUS_REPLY = 0x07
CMD_DEVICE_INFO = 0xCD
CMD_CONTROL = 0xCE
CMD_QUERY = 0xCF
ACK_PAYLOADS = {
    CMD_REGISTER: bytes(8),
    CMD_DEVICE_INFO_REPLY: bytes(8),
    CMD_STATUS_REPLY: b"\x01",
}

MODE_POWER_OFF = 1
MODE_POWER_ON = 2
MODE_GOOUT_OFF = 3
MODE_GOOUT_ON = 4
MODE_INSIDE_HEAT = 5
MODE_ONDOL_HEAT = 6
MODE_WATER_SET_TEMP = 11

CURRENT_MODES = {
    1: "off",
    2: "on",
    3: "away_off",
    4: "away",
    5: "room",
    6: "water",
    7: "repeat_reserve",
    8: "circle_reserve",
    9: "simple_reserve",
    10: "hot_water_only",
}

HEATING_MODE_ROOM = "room"
HEATING_MODE_WATER = "water"
HEATING_MODE_AWAY = "away"
HEATING_MODES = (HEATING_MODE_ROOM, HEATING_MODE_WATER, HEATING_MODE_AWAY)

ERROR_KEYS = {
    0: "ok",
    3: "e003",
    4: "e004",
    12: "e012",
    16: "e016",
    46: "e046",
    49: "e049",
    56: "e056",
    94: "e094",
    109: "e109",
    110: "e110",
    127: "e127",
    157: "e157",
    205: "e205",
    218: "e218",
    302: "e302",
    313: "e313",
    407: "e407",
    515: "e515",
    517: "e517",
    594: "e594",
    615: "e615",
    740: "e740",
    782: "e782",
}

ROOM_TEMP_MIN = 10.0
ROOM_TEMP_MAX = 40.0
WATER_TEMP_MIN = 40.0
WATER_TEMP_MAX = 80.0
DHW_TEMP_MIN = 30.0
DHW_TEMP_MAX = 60.0
