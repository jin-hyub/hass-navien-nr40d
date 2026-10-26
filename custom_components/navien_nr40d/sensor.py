"""Diagnostic and measurement sensors."""

from __future__ import annotations

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CURRENT_MODES, DOMAIN, ERROR_KEYS
from .coordinator import NavienCoordinator
from .entity import NavienEntity


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    coordinator: NavienCoordinator = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(
        [
            NavienRoomTempSensor(coordinator),
            NavienModeSensor(coordinator),
            NavienErrorSensor(coordinator),
        ]
    )


class NavienRoomTempSensor(NavienEntity, SensorEntity):
    _attr_translation_key = "room_temp"
    _attr_device_class = SensorDeviceClass.TEMPERATURE
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    _attr_suggested_display_precision = 1

    def __init__(self, coordinator: NavienCoordinator) -> None:
        super().__init__(coordinator, "room_temp")

    @property
    def available(self) -> bool:
        return super().available and self.status is not None

    @property
    def native_value(self) -> float | None:
        return None if self.status is None else self.status.room_temp


class NavienModeSensor(NavienEntity, SensorEntity):
    _attr_translation_key = "mode"
    # Enum metadata lets HA translate states while preserving their raw keys.
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = list(CURRENT_MODES.values())

    def __init__(self, coordinator: NavienCoordinator) -> None:
        super().__init__(coordinator, "mode")

    @property
    def available(self) -> bool:
        return super().available and self.status is not None

    @property
    def native_value(self) -> str | None:
        if self.status is None:
            return None
        mode = self.status.current_mode
        return mode if mode in self._attr_options else None


class NavienErrorSensor(NavienEntity, SensorEntity):
    _attr_translation_key = "error"
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = [*ERROR_KEYS.values(), "unknown"]
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, coordinator: NavienCoordinator) -> None:
        super().__init__(coordinator, "error")

    @property
    def available(self) -> bool:
        return super().available and self.status is not None

    @property
    def native_value(self) -> str | None:
        return None if self.status is None else self.status.error_key

    @property
    def extra_state_attributes(self) -> dict[str, int] | None:
        if self.status is None:
            return None
        return {"code": self.status.error_code}
