"""Exercise the real local control/select classes without installing Home Assistant."""
import importlib
import pathlib
import sys
import types
import unittest
from unittest.mock import AsyncMock, Mock, patch

ROOT = pathlib.Path(__file__).resolve().parents[1]


def stub(name, **attributes):
    module = types.ModuleType(name)
    module.__path__ = []
    module.__dict__.update(attributes)
    sys.modules[name] = module


class CoordinatorBase:
    @classmethod
    def __class_getitem__(cls, _item):
        return cls


class EntityBase(CoordinatorBase):
    def __init__(self, coordinator):
        self.coordinator = coordinator

    @property
    def available(self):
        return True


for name in ('homeassistant', 'homeassistant.components', 'homeassistant.helpers'):
    stub(name)
stub('homeassistant.config_entries', ConfigEntry=object)
stub('homeassistant.const', CONF_HOST='host', CONF_NAME='name',
     UnitOfTemperature=types.SimpleNamespace(CELSIUS='°C'))
stub('homeassistant.core', HomeAssistant=object)
stub('homeassistant.helpers.device_registry', CONNECTION_NETWORK_MAC='mac', DeviceInfo=dict)
stub('homeassistant.helpers.update_coordinator', DataUpdateCoordinator=CoordinatorBase, CoordinatorEntity=EntityBase)
stub('homeassistant.helpers.entity_platform', AddEntitiesCallback=object)
stub('homeassistant.helpers.entity', EntityCategory=types.SimpleNamespace(DIAGNOSTIC='diagnostic'))
stub('homeassistant.components.select', SelectEntity=type('SelectEntity', (), {}))
stub('homeassistant.components.sensor', SensorEntity=type('SensorEntity', (), {}),
     SensorDeviceClass=types.SimpleNamespace(TEMPERATURE='temperature', ENUM='enum'),
     SensorStateClass=types.SimpleNamespace(MEASUREMENT='measurement'))
package = types.ModuleType('navien_nr40d')
package.__path__ = [str(ROOT / 'custom_components/navien_nr40d')]
sys.modules['navien_nr40d'] = package
coordinator_module = importlib.import_module('navien_nr40d.coordinator')
protocol = importlib.import_module('navien_nr40d.protocol')
select_module = importlib.import_module('navien_nr40d.select')
sensor_module = importlib.import_module('navien_nr40d.sensor')


class HeatingModeTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.coordinator = object.__new__(coordinator_module.NavienCoordinator)
        self.coordinator.entry = types.SimpleNamespace(entry_id='test-entry')
        self.coordinator.data = protocol.NavienData(status=protocol.NavienStatus(
            current_mode='away', room_target=24, water_target=55,
        ))
        self.coordinator.async_control = AsyncMock()
        self.select = select_module.NavienHeatingModeSelect(self.coordinator)

    async def test_all_three_options_dispatch_actual_protocol_values(self):
        # Binary setpoints use half-degree units; mode changes preserve each target.
        for option, expected in (('room', (5, 48)), ('water', (6, 110)), ('away', (4,))):
            with self.subTest(option=option):
                self.coordinator.async_control.reset_mock()
                await self.select.async_select_option(option)
                self.coordinator.async_control.assert_awaited_once_with(*expected)

    async def test_away_report_is_selected_without_an_optimistic_state_change(self):
        await self.select.async_select_option('room')
        self.assertEqual(self.select.current_option, 'away')
        for mode in ('room', 'water', 'away'):
            self.coordinator.data.status.current_mode = mode
            self.assertEqual(self.select.current_option, mode)

    def test_other_modes_are_not_misrepresented_as_a_heating_selection(self):
        self.coordinator.data.status.current_mode = 'off'
        self.assertIsNone(self.select.current_option)
        self.coordinator.data.status = None
        self.assertIsNone(self.select.current_option)

    def test_enum_sensors_keep_raw_keys_for_automations_and_accept_unknown_reports(self):
        mode = sensor_module.NavienModeSensor(self.coordinator)
        error = sensor_module.NavienErrorSensor(self.coordinator)
        self.assertEqual(mode.native_value, 'away')
        self.assertIn(mode.native_value, mode._attr_options)
        self.assertEqual(error.native_value, 'ok')
        self.assertIn(error.native_value, error._attr_options)
        self.coordinator.data.status.current_mode = '99'
        self.coordinator.data.status.error_key = 'unknown'
        self.assertIsNone(mode.native_value)
        self.assertIn(error.native_value, error._attr_options)


class ConnectionTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.coordinator = object.__new__(coordinator_module.NavienCoordinator)
        self.coordinator.entry = types.SimpleNamespace(data={}, options={})
        self.coordinator._servers = []
        self.coordinator._poll_task = None
        self.coordinator._query_task = None
        self.coordinator._writer = None
        self.coordinator._gw = b'12345678'
        self.coordinator._set_data = Mock()

    async def test_send_failure_clears_connection_without_stopping_caller(self):
        writer = Mock()
        writer.drain = AsyncMock(side_effect=ConnectionResetError('reset'))
        self.coordinator._writer = writer
        await self.coordinator._send_raw(b'test')
        self.assertIsNone(self.coordinator._writer)
        self.assertIsNone(self.coordinator._gw)
        self.coordinator._set_data.assert_called_once_with(connected=False, peer=None)
        writer.close.assert_called_once()

    async def test_old_send_failure_does_not_clear_replacement_connection(self):
        old_writer, new_writer = Mock(), Mock()
        async def replace_connection():
            self.coordinator._writer = new_writer
            raise ConnectionResetError('old connection')
        old_writer.drain = replace_connection
        self.coordinator._writer = old_writer
        await self.coordinator._send_raw(b'test')
        self.assertIs(self.coordinator._writer, new_writer)
        self.coordinator._set_data.assert_not_called()

    async def test_partial_listen_failure_closes_opened_ports(self):
        server = Mock()
        server.wait_closed = AsyncMock()
        with patch.object(coordinator_module.asyncio, 'start_server',
                          AsyncMock(side_effect=[server, OSError('port in use')])):
            with self.assertRaises(OSError):
                await self.coordinator.async_setup()
        server.close.assert_called_once()
        server.wait_closed.assert_awaited_once()
        self.assertEqual(self.coordinator._servers, [])


if __name__ == '__main__':
    unittest.main()
