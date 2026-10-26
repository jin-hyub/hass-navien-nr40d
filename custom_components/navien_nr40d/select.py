"""Heating mode select."""

from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, HEATING_MODES
from .entity import NavienEntity


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    async_add_entities([NavienHeatingModeSelect(hass.data[DOMAIN][entry.entry_id])])


class NavienHeatingModeSelect(NavienEntity, SelectEntity):
    _attr_translation_key = "heating_mode"
    _attr_options = list(HEATING_MODES)

    def __init__(self, coordinator) -> None:
        super().__init__(coordinator, "heating_mode")

    @property
    def available(self) -> bool:
        return super().available and self.status is not None

    @property
    def current_option(self) -> str | None:
        status = self.status
        if status is None:
            return None
        if status.current_mode in HEATING_MODES:
            return status.current_mode
        return None

    async def async_select_option(self, option: str) -> None:
        await self.coordinator.async_set_heating_mode(option)
