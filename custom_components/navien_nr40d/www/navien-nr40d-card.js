const CARD_VERSION = "0.3.6";
const CARD_TYPE = "navien-nr40d-card";

const STRINGS = {
  ko: {
    title: "나비엔",
    room: "현재 실내 온도",
    target: "실내 설정 온도",
    on: "켜짐",
    off: "꺼짐",
    away: "외출",
    mode_room: "실내난방",
    mode_water: "온돌난방",
    water: "온돌 설정 온도",
    dhw: "온수 설정 온도",
    heating: "난방 중",
    idle: "대기 중",
    offline: "조절기가 연결되어 있지 않습니다",
    pick: "나비엔 NR-40D 기기를 선택해 주세요",
    missing: "보일러 엔티티를 찾을 수 없습니다",
    tip_link_on: "조절기가 연결되어 있습니다",
    tip_link_off: "조절기와 연결되어 있지 않습니다",
    tip_flame_on: "버너가 연소 중입니다",
    tip_flame_off: "버너가 꺼져 있습니다",
    tip_outdoor_on: "보일러에 외기 온도 센서가 연결되어 있습니다",
    tip_outdoor_off: "연결된 외기 온도 센서가 없습니다",
    tip_away_on: "외출 모드가 켜져 있습니다",
    tip_error_ok: "오류가 없습니다",
    tip_error: "보일러 오류",
    tip_room: "조절기 센서에서 측정한 현재 실내 온도",
    tip_target: "원하는 실내 온도입니다. 현재 온도가 설정 온도보다 낮으면 난방합니다",
    tip_minus: "설정 온도 1°C 낮추기",
    tip_plus: "설정 온도 1°C 높이기",
    tip_off: "난방 끄기",
    tip_on: "난방 켜기",
    tip_away: "집을 비울 때 사용하는 외출 모드",
    tip_mode_room: "실내 공기 온도를 기준으로 난방합니다",
    tip_mode_water: "난방수 온도를 기준으로 난방합니다",
    tip_water: "온돌난방에서 사용하는 난방수 설정 온도",
    tip_dhw: "수도에서 사용하는 온수 설정 온도",
  },
  en: {
    title: "Navien",
    room: "Room",
    target: "Target",
    on: "On",
    off: "Off",
    away: "Away",
    mode_room: "Room",
    mode_water: "Water",
    water: "Heating water",
    dhw: "Hot water",
    heating: "Heating",
    idle: "Idle",
    offline: "Controller is offline",
    pick: "Select the Navien NR-40D device",
    missing: "Boiler entities were not found",
    tip_link_on: "Controller is online",
    tip_link_off: "No link to the controller",
    tip_flame_on: "Burner is on",
    tip_flame_off: "Burner is off",
    tip_outdoor_on: "Outdoor sensor is connected to the boiler",
    tip_outdoor_off: "No outdoor sensor detected",
    tip_away_on: "Away mode is on",
    tip_error_ok: "No errors",
    tip_error: "Boiler error",
    tip_room: "Room temperature from the controller sensor",
    tip_target: "Target: the room temperature you want. The boiler heats while the room is colder",
    tip_minus: "Lower the target by 1°",
    tip_plus: "Raise the target by 1°",
    tip_off: "Turn heating off",
    tip_on: "Turn heating on",
    tip_away: "Economy mode while nobody is home",
    tip_mode_room: "Keep the room air temperature",
    tip_mode_water: "Keep the radiator water temperature",
    tip_water: "Radiator water temperature, used in the water mode",
    tip_dhw: "Tap hot water temperature",
  },
  ru: {
    title: "Navien",
    room: "Комната",
    target: "Уставка",
    on: "Вкл",
    off: "Выкл",
    away: "Вне дома",
    mode_room: "По комнате",
    mode_water: "По теплоносителю",
    water: "Теплоноситель",
    dhw: "ГВС",
    heating: "Нагрев",
    idle: "Ожидание",
    offline: "Пульт не на связи",
    pick: "Выберите устройство Navien NR-40D",
    missing: "Сущности котла не найдены",
    tip_link_on: "Связь с пультом есть",
    tip_link_off: "Нет связи с пультом",
    tip_flame_on: "Горелка работает",
    tip_flame_off: "Горелка не горит",
    tip_outdoor_on: "Уличный датчик подключён к котлу",
    tip_outdoor_off: "Уличный датчик не обнаружен",
    tip_away_on: "Включён режим «Вне дома»",
    tip_error_ok: "Ошибок нет",
    tip_error: "Ошибка котла",
    tip_room: "Температура в комнате по датчику пульта",
    tip_target: "Уставка — желаемая температура в комнате. Котёл греет, пока в комнате холоднее",
    tip_minus: "Уменьшить уставку на 1°",
    tip_plus: "Увеличить уставку на 1°",
    tip_off: "Выключить отопление",
    tip_on: "Включить отопление",
    tip_away: "Экономный режим на время, пока никого нет дома",
    tip_mode_room: "Котёл держит температуру воздуха в комнате",
    tip_mode_water: "Котёл держит температуру воды в батареях",
    tip_water: "Температура воды в батареях, для режима «По теплоносителю»",
    tip_dhw: "Температура горячей воды из крана",
  },
};

const STYLE = `
:host {
  display: block;
  --navien-accent: #f97316;
  --navien-accent-text: #fbbf24;
  --navien-good: var(--success-color, #22c55e);
  --navien-bad: var(--error-color, #ef4444);
  --navien-line: var(--divider-color, rgba(127,127,127,.22));
  --navien-tile: color-mix(in srgb, var(--primary-text-color, #fff) 4%, transparent);
  --navien-track: color-mix(in srgb, var(--primary-text-color, #fff) 16%, transparent);
  --mdc-icon-size: 20px;
}
ha-card { padding: 0; }
ha-icon { display: inline-flex; }
.wrap {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tile {
  background: var(--navien-tile);
  border: 1px solid var(--navien-line);
  border-radius: 16px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.logo {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  background: var(--navien-tile);
  border: 1px solid var(--navien-line);
  color: var(--secondary-text-color);
  --mdc-icon-size: 26px;
}
.logo.on {
  color: var(--navien-accent);
  background: color-mix(in srgb, var(--navien-accent) 18%, transparent);
  border-color: color-mix(in srgb, var(--navien-accent) 35%, transparent);
}
.logo.flame ha-icon { animation: flicker 1.4s ease-in-out infinite; }
.title {
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.subtitle {
  color: var(--secondary-text-color);
  font-size: 0.9rem;
  margin-top: 2px;
}
.badges {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.badge {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: var(--navien-tile);
  border: 1px solid var(--navien-line);
  color: var(--disabled-text-color, #9ca3af);
  --mdc-icon-size: 22px;
}
.badge.good {
  color: var(--navien-good);
  border-color: color-mix(in srgb, var(--navien-good) 30%, transparent);
}
.badge.bad {
  color: var(--navien-bad);
  background: color-mix(in srgb, var(--navien-bad) 14%, transparent);
  border-color: color-mix(in srgb, var(--navien-bad) 40%, transparent);
}
.badge.hot {
  color: var(--navien-accent);
  background: color-mix(in srgb, var(--navien-accent) 18%, transparent);
  border-color: color-mix(in srgb, var(--navien-accent) 35%, transparent);
}
.badge.hot ha-icon { animation: flicker 1.4s ease-in-out infinite; }
.badge.info {
  color: var(--info-color, #3b82f6);
  border-color: color-mix(in srgb, var(--info-color, #3b82f6) 35%, transparent);
}
.hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}
.room {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 16px;
}
.room-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--secondary-text-color);
  font-size: 0.9rem;
  --mdc-icon-size: 30px;
}
.temp {
  font-size: 3.6rem;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.04em;
}
.temp small {
  font-size: 2rem;
  font-weight: 700;
  vertical-align: top;
}
.setpoint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 14px 12px;
}
.btn {
  appearance: none;
  border: 1px solid var(--navien-line);
  background: var(--navien-tile);
  color: var(--primary-text-color);
  width: 46px;
  height: 46px;
  border-radius: 14px;
  cursor: pointer;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  --mdc-icon-size: 24px;
}
.btn:hover { border-color: color-mix(in srgb, var(--navien-accent) 50%, transparent); }
.btn:disabled { opacity: .4; cursor: default; }
.target { text-align: center; min-width: 3.6rem; }
.target-value {
  font-weight: 800;
  font-size: 1.9rem;
  line-height: 1.1;
}
.target-label {
  color: var(--secondary-text-color);
  font-size: 0.9rem;
}
.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.seg {
  display: flex;
  gap: 4px;
  padding: 4px;
}
.row .seg { flex: 1 1 220px; }
.seg button, .chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font: inherit;
  font-size: 1rem;
  font-weight: 650;
  cursor: pointer;
  border-radius: 12px;
}
.seg button {
  flex: 1;
  border: 1px solid transparent;
  background: transparent;
  color: var(--secondary-text-color);
  padding: 10px 12px;
}
.seg button:hover:not(.active) { color: var(--primary-text-color); }
.seg button.active {
  color: var(--primary-text-color);
  background: color-mix(in srgb, var(--navien-accent) 16%, transparent);
  border-color: var(--navien-accent);
}
.seg button.active ha-icon { color: var(--navien-accent); }
.seg button.active.power-on { color: var(--navien-accent-text); }
.chip {
  flex: 0 1 auto;
  padding: 12px 18px;
  color: var(--primary-text-color);
}
.chip:hover { border-color: color-mix(in srgb, var(--navien-accent) 50%, transparent); }
.chip.active {
  color: var(--info-color, #3b82f6);
  background: color-mix(in srgb, var(--info-color, #3b82f6) 14%, transparent);
  border-color: var(--info-color, #3b82f6);
}
.slider-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 14px 16px 16px;
}
.slider-row label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: var(--secondary-text-color);
  justify-self: start;
  --mdc-icon-size: 22px;
}
.slider-row .value {
  font-size: 1.2rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
input[type=range] {
  grid-column: 1 / -1;
  width: 100%;
  margin: 4px 0 0;
  height: 8px;
  border-radius: 999px;
  appearance: none;
  -webkit-appearance: none;
  background: linear-gradient(to right, var(--navien-accent) 0 var(--pct, 0%), var(--navien-track) var(--pct, 0%) 100%);
  cursor: pointer;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 0;
  background: var(--navien-accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--navien-accent) 22%, transparent);
}
input[type=range]::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 0;
  background: var(--navien-accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--navien-accent) 22%, transparent);
}
input[type=range]::-moz-range-track { background: transparent; }
.banner {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 14px;
  padding: 10px 12px;
  font-size: 0.9rem;
  background: color-mix(in srgb, var(--navien-bad) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--navien-bad) 40%, transparent);
  color: var(--navien-bad);
}
.warning {
  opacity: .85;
  text-align: center;
  padding: 18px 8px;
  color: var(--secondary-text-color);
}
[data-tip] { position: relative; }
[data-tip]::after {
  content: attr(data-tip);
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translate(-50%, 4px);
  width: max-content;
  max-width: 240px;
  padding: 6px 9px;
  border-radius: 8px;
  background: var(--primary-text-color, #111);
  color: var(--card-background-color, #fff);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.3;
  text-align: left;
  white-space: normal;
  pointer-events: none;
  opacity: 0;
  transition: opacity .12s ease, transform .12s ease;
  z-index: 10;
}
[data-tip]:hover::after, [data-tip]:focus-visible::after {
  opacity: 1;
  transform: translate(-50%, 0);
}
.badge[data-tip]::after {
  left: auto;
  right: 0;
  top: calc(100% + 8px);
  bottom: auto;
  transform: translateY(-4px);
}
.badge[data-tip]:hover::after { transform: translateY(0); }
.tip-start[data-tip]::after { left: 0; transform: translateY(4px); }
.tip-start[data-tip]:hover::after { transform: translateY(0); }
.tip-end[data-tip]::after { left: auto; right: 0; transform: translateY(4px); }
.tip-end[data-tip]:hover::after { transform: translateY(0); }
@keyframes flicker {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: .8; }
}
`;

function lang(hass) {
  const code = (hass && (hass.locale?.language || hass.language) || "en").toLowerCase();
  return code.startsWith("ko") ? "ko" : code.startsWith("ru") ? "ru" : "en";
}

function t(hass, key) {
  return STRINGS[lang(hass)][key] || STRINGS.en[key] || key;
}

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

const ROOM_OPTIONS = ["room", "По комнате"];
const WATER_OPTIONS = ["water", "По теплоносителю"];
const OK_ERRORS = ["ok", "none", "нет", "unavailable", "unknown", "0", ""];

function isRoom(state) {
  return ROOM_OPTIONS.includes(state);
}

function isWater(state) {
  return WATER_OPTIONS.includes(state);
}

function optionFor(state, wanted) {
  const options = state?.attributes?.options || [];
  return wanted.find((item) => options.includes(item)) || wanted[0];
}

function normalizeDeviceId(value) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return normalizeDeviceId(value[0]);
  if (typeof value === "object") {
    return normalizeDeviceId(value.id || value.device_id || value.device || value.value);
  }
  return "";
}

function registryList(hass) {
  const raw = hass?.entities;
  if (!raw) return [];
  return (Array.isArray(raw) ? raw : Object.values(raw)).filter(Boolean);
}

function entryEntityId(entry, fallback) {
  return entry?.entity_id || entry?.entityId || fallback || "";
}

function entryDeviceId(entry) {
  return entry?.device_id || entry?.deviceId || "";
}

function isNavienId(hass, entityId) {
  if (!entityId) return false;
  const entry = hass?.entities?.[entityId];
  return entry?.platform === "navien_nr40d" || String(entityId).includes("navien");
}

function matchHint(entityId, entry, hints) {
  const uniqueId = String(entry?.unique_id || "").toLowerCase();
  const key = String(entry?.translation_key || "").toLowerCase();
  const name = String(entry?.name || entry?.original_name || "").toLowerCase();
  const id = String(entityId || "").toLowerCase();
  return hints.some((hint) => {
    const needle = String(hint).toLowerCase();
    return id.includes(needle) || uniqueId.includes(needle) || key === needle || name.includes(needle);
  });
}

function idsOnDevice(hass, deviceId) {
  const id = normalizeDeviceId(deviceId);
  const found = [];
  const seen = new Set();
  const add = (entityId) => {
    if (!entityId || seen.has(entityId)) return;
    seen.add(entityId);
    found.push(entityId);
  };

  if (id) {
    for (const entry of registryList(hass)) {
      if (entryDeviceId(entry) === id) add(entryEntityId(entry));
    }
    const configEntries = hass?.devices?.[id]?.config_entries || [];
    for (const entry of registryList(hass)) {
      if (configEntries.includes(entry.config_entry_id)) add(entryEntityId(entry));
    }
  }

  for (const entityId of Object.keys(hass?.states || {})) {
    const entry = hass?.entities?.[entityId];
    if (id && entryDeviceId(entry) === id) add(entityId);
    else if (isNavienId(hass, entityId)) add(entityId);
  }
  return found;
}

function pickDomain(ids, hass, domain, hints) {
  let candidates = (ids || []).filter((entityId) => entityId.startsWith(`${domain}.`));
  if (!candidates.length) {
    candidates = Object.keys(hass?.states || {}).filter(
      (entityId) => entityId.startsWith(`${domain}.`) && isNavienId(hass, entityId)
    );
  }
  const native = candidates.filter((entityId) => hass?.entities?.[entityId]?.platform === "navien_nr40d");
  if (native.length) candidates = native;
  for (const hint of hints || []) {
    const hit = candidates.find((entityId) => matchHint(entityId, hass?.entities?.[entityId], [hint]));
    if (hit) return hit;
  }
  if (hints && hints.length) return candidates.length === 1 ? candidates[0] : null;
  return candidates[0] || null;
}

function pickClimate(ids, hass) {
  return (
    pickDomain(ids, hass, "climate", ["boiler", "kotel", "climate", "navien"]) ||
    Object.keys(hass?.states || {}).find((entityId) => {
      if (!entityId.startsWith("climate.")) return false;
      const name = String(hass.states[entityId].attributes?.friendly_name || "").toLowerCase();
      return entityId.includes("navien") || name.includes("navien") || name.includes("котёл") || name.includes("котел");
    }) ||
    null
  );
}

function icon(name) {
  return `<ha-icon icon="${name}"></ha-icon>`;
}

function sliderPct(value, min, max) {
  if (!(max > min)) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

class NavienNr40dCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this._config = {};
    this._ids = null;
    this._signature = "";
    this._dragging = false;
  }

  static getConfigForm() {
    return {
      schema: [
        {
          name: "device",
          selector: { device: { filter: { integration: "navien_nr40d" } } },
        },
        { name: "name", selector: { text: {} } },
      ],
    };
  }

  static getStubConfig(hass) {
    try {
      const ids = idsOnDevice(hass, "");
      const climate = pickClimate(ids, hass);
      const any = climate || ids[0];
      const fromRegistry = registryList(hass).find((entry) => entryEntityId(entry) === any);
      return { device: entryDeviceId(hass?.entities?.[any]) || entryDeviceId(fromRegistry) || "" };
    } catch (error) {
      return { device: "" };
    }
  }

  setConfig(config) {
    this._config = config || {};
    this._ids = null;
    this._signature = "";
    this._safeRender();
  }

  set hass(hass) {
    const registryChanged = !this._hass || this._hass.entities !== hass.entities;
    this._hass = hass;
    if (registryChanged) this._ids = null;
    this._safeRender();
  }

  _safeRender() {
    try {
      this._render();
    } catch (error) {
      console.error("navien-nr40d-card", error);
    }
  }

  getCardSize() {
    return 5;
  }

  _entities() {
    if (this._ids) return this._ids;
    const hass = this._hass;
    const deviceId = normalizeDeviceId(this._config.device)
      || entryDeviceId(hass?.entities?.[this._config.entity]);
    const ids = idsOnDevice(hass, deviceId);
    const configured = this._config.entity && hass?.states?.[this._config.entity] ? this._config.entity : null;
    const result = {
      climate: configured?.startsWith("climate.") ? configured : pickClimate(ids, hass),
      room: this._config.room_entity || pickDomain(ids, hass, "sensor", ["room_temp", "room_temperature", "комнат"]),
      room_target: this._config.room_target_entity || pickDomain(ids, hass, "number", ["room_target", "room_setpoint"]),
      water: this._config.water_entity || pickDomain(ids, hass, "number", ["water_temp", "heating_water", "теплоносител", "teplonos"]),
      dhw: this._config.dhw_entity || pickDomain(ids, hass, "number", ["dhw_temp", "dhw", "гвс", "gvs"]),
      mode: this._config.mode_entity || pickDomain(ids, hass, "select", ["heating_mode"]),
      mode_sensor: pickDomain(ids, hass, "sensor", ["mode"]),
      power: this._config.power_entity || pickDomain(ids, hass, "switch", ["power", "отопление"]),
      away: this._config.away_entity || pickDomain(ids, hass, "switch", ["away"]),
      connected: this._config.connected_entity || pickDomain(ids, hass, "binary_sensor", ["connected", "controller_link"]),
      flame: this._config.flame_entity || pickDomain(ids, hass, "binary_sensor", ["flame", "пламя"]),
      outdoor: this._config.outdoor_sensor_entity || pickDomain(ids, hass, "binary_sensor", ["outdoor_sensor", "уличн"]),
      error: this._config.error_entity || pickDomain(ids, hass, "sensor", ["error", "ошиб"]),
    };
    if (hass && Object.values(result).some(Boolean)) this._ids = result;
    return result;
  }

  _call(domain, service, entityId, data = {}) {
    if (!this._hass || !entityId) return;
    this._hass.callService(domain, service, { entity_id: entityId, ...data });
  }

  _render() {
    const hass = this._hass;
    const root = this.shadowRoot;
    if (!root) return;
    const ids = this._entities();
    const signature = JSON.stringify([
      lang(hass),
      this._config,
      Object.values(ids).map((id) => {
        const state = hass?.states?.[id];
        return state ? [id, state.state, state.last_updated] : id;
      }),
    ]);
    // Dashboards push every HA state change; redrawing would drop hovers and slider drags.
    if (signature === this._signature || this._dragging) return;
    this._signature = signature;

    const st = (key) => hass?.states?.[ids[key]];
    const climate = st("climate");
    const room = st("room");
    const roomTarget = st("room_target");
    const power = st("power");
    const connected = st("connected");
    const flame = st("flame");
    const outdoor = st("outdoor");
    const water = st("water");
    const dhw = st("dhw");
    const mode = st("mode");
    const modeSensor = st("mode_sensor");
    const away = st("away");
    const error = st("error");
    const deviceId = normalizeDeviceId(this._config.device);
    const deviceName = hass?.devices?.[deviceId]?.name_by_user || hass?.devices?.[deviceId]?.name;
    const name = this._config.name || deviceName || climate?.attributes?.friendly_name || t(hass, "title");
    const online = connected
      ? connected.state === "on"
      : Boolean(climate || room || water || dhw);
    const burning = flame ? flame.state === "on" : climate?.attributes?.hvac_action === "heating";
    const current = num(climate?.attributes?.current_temperature) ?? num(room?.state);
    const target = num(climate?.attributes?.temperature) ?? num(roomTarget?.state);
    const min = num(climate?.attributes?.min_temp) ?? num(roomTarget?.attributes?.min) ?? 10;
    const max = num(climate?.attributes?.max_temp) ?? num(roomTarget?.attributes?.max) ?? 40;
    const modeValue = [mode?.state, modeSensor?.state].find(
      (value) => value && !["unknown", "unavailable"].includes(value)
    );
    const heatOn = climate?.state === "heat" || power?.state === "on"
      || ["on", "room", "water", "away", "heat"].includes(modeValue);
    const awayOn = away?.state === "on" || climate?.attributes?.preset_mode === "away" || modeValue === "away";
    const errorText =
      error && error.state && !OK_ERRORS.includes(String(error.state).trim().toLowerCase())
        ? error.state
        : null;
    const ready = Boolean(climate || room || roomTarget || water || dhw || mode || power || away);
    const hasDevice = Boolean(deviceId || this._config.entity);
    const canSetRoom = Boolean(ids.climate || ids.room_target);
    const canPower = Boolean(ids.climate || ids.power);
    const subtitle = !heatOn ? t(hass, "off") : burning ? t(hass, "heating") : t(hass, "idle");
    const tip = (key) => this._escape(t(hass, key));

    const badges = [
      `<div class="badge ${online ? "good" : "bad"}" data-tip="${tip(online ? "tip_link_on" : "tip_link_off")}">
        ${icon(online ? "mdi:lan-connect" : "mdi:lan-disconnect")}</div>`,
      ready ? `<div class="badge ${burning ? "hot" : ""}" data-tip="${tip(burning ? "tip_flame_on" : "tip_flame_off")}">
        ${icon(burning ? "mdi:fire" : "mdi:fire-off")}</div>` : "",
      outdoor ? `<div class="badge ${outdoor.state === "on" ? "good" : ""}"
        data-tip="${tip(outdoor.state === "on" ? "tip_outdoor_on" : "tip_outdoor_off")}">
        ${icon(outdoor.state === "on" ? "mdi:sun-thermometer-outline" : "mdi:thermometer-off")}</div>` : "",
      awayOn ? `<div class="badge info" data-tip="${tip("tip_away_on")}">${icon("mdi:home-export-outline")}</div>` : "",
      error ? `<div class="badge ${errorText ? "bad" : "good"}"
        data-tip="${errorText ? `${tip("tip_error")}: ${this._escape(errorText)}` : tip("tip_error_ok")}">
        ${icon(errorText ? "mdi:alert-circle-outline" : "mdi:check-circle-outline")}</div>` : "",
    ].join("");

    root.innerHTML = `
      <style>${STYLE}</style>
      <ha-card>
        <div class="wrap">
          <div class="header">
            <div class="brand">
              <div class="logo ${heatOn ? "on" : ""} ${burning ? "flame" : ""}" aria-hidden="true">
                ${icon(burning ? "mdi:fire" : "mdi:water-boiler")}
              </div>
              <div>
                <div class="title">${this._escape(name)}</div>
                <div class="subtitle">${subtitle}</div>
              </div>
            </div>
            <div class="badges">${badges}</div>
          </div>
          ${!hasDevice && !ready ? `<div class="warning">${t(hass, "pick")}</div>` : ""}
          ${hasDevice && !ready ? `<div class="warning">${t(hass, "missing")}</div>` : ""}
          ${ready && !online ? `<div class="warning">${t(hass, "offline")}</div>` : ""}
          ${ready ? `
            <div class="hero">
              <div class="tile room tip-start" data-tip="${tip("tip_room")}">
                <div class="room-label">${icon("mdi:home-outline")}${t(hass, "room")}</div>
                <div class="temp">${current ?? "–"}<small>°</small></div>
              </div>
              ${canSetRoom ? `
              <div class="tile setpoint">
                <button class="btn tip-start" data-act="temp-down" data-tip="${tip("tip_minus")}"
                  aria-label="${tip("tip_minus")}" ${target <= min ? "disabled" : ""}>${icon("mdi:minus")}</button>
                <div class="target" data-tip="${tip("tip_target")}">
                  <div class="target-value">${target ?? "–"}°</div>
                  <div class="target-label">${t(hass, "target")}</div>
                </div>
                <button class="btn tip-end" data-act="temp-up" data-tip="${tip("tip_plus")}"
                  aria-label="${tip("tip_plus")}" ${target >= max ? "disabled" : ""}>${icon("mdi:plus")}</button>
              </div>
              ` : ""}
            </div>
            ${canPower || away ? `
            <div class="row">
              ${canPower ? `
              <div class="tile seg">
                <button data-act="off" class="tip-start ${heatOn ? "" : "active"}" data-tip="${tip("tip_off")}">
                  ${icon("mdi:circle-outline")}${t(hass, "off")}</button>
                <button data-act="on" class="${heatOn ? "active power-on" : ""}" data-tip="${tip("tip_on")}">
                  ${icon("mdi:power")}${t(hass, "on")}</button>
              </div>
              ` : ""}
              ${away ? `
                <button class="tile chip tip-end ${awayOn ? "active" : ""}" data-act="away" data-tip="${tip("tip_away")}">
                  ${icon("mdi:home-export-outline")}${t(hass, "away")}</button>
              ` : ""}
            </div>
            ` : ""}
            ${mode ? `
              <div class="tile seg">
                <button data-act="mode-room" class="tip-start ${isRoom(modeValue) ? "active" : ""}" data-tip="${tip("tip_mode_room")}">
                  ${icon("mdi:home-thermometer-outline")}${t(hass, "mode_room")}</button>
                <button data-act="mode-water" class="tip-end ${isWater(modeValue) ? "active" : ""}" data-tip="${tip("tip_mode_water")}">
                  ${icon("mdi:radiator")}${t(hass, "mode_water")}</button>
              </div>
            ` : ""}
            ${water ? this._slider("water", t(hass, "water"), "mdi:radiator", tip("tip_water"), water) : ""}
            ${dhw ? this._slider("dhw", t(hass, "dhw"), "mdi:water-boiler", tip("tip_dhw"), dhw) : ""}
            ${errorText ? `<div class="banner">${icon("mdi:alert-circle-outline")}${this._escape(errorText)}</div>` : ""}
          ` : ""}
        </div>
      </ha-card>
    `;
    this._bind({ target, awayOn, ids });
  }

  _slider(kind, label, iconName, hint, state) {
    const value = num(state.state) ?? 0;
    const min = num(state.attributes.min) ?? 30;
    const max = num(state.attributes.max) ?? 80;
    const step = num(state.attributes.step) ?? 1;
    return `
      <div class="tile slider-row">
        <label class="tip-start" data-tip="${hint}">${icon(iconName)}${label}</label>
        <div class="value">${value}°</div>
        <input type="range" data-slider="${kind}" min="${min}" max="${max}" step="${step}" value="${value}"
          style="--pct: ${sliderPct(value, min, max)}%" aria-label="${this._escape(label)}">
      </div>
    `;
  }

  _bind(ctx) {
    const root = this.shadowRoot;
    const click = (act, handler) => root.querySelector(`[data-act="${act}"]`)?.addEventListener("click", handler);
    const setRoom = (value) => {
      if (ctx.ids.climate) {
        this._call("climate", "set_temperature", ctx.ids.climate, { temperature: value });
      } else {
        this._call("number", "set_value", ctx.ids.room_target, { value });
      }
    };
    const setPower = (on) => {
      if (ctx.ids.climate) {
        this._call("climate", "set_hvac_mode", ctx.ids.climate, { hvac_mode: on ? "heat" : "off" });
      } else {
        this._call("switch", on ? "turn_on" : "turn_off", ctx.ids.power);
      }
    };
    click("temp-down", () => ctx.target != null && setRoom(ctx.target - 1));
    click("temp-up", () => ctx.target != null && setRoom(ctx.target + 1));
    click("off", () => setPower(false));
    click("on", () => setPower(true));
    click("away", () => {
      if (ctx.ids.away) {
        this._call("switch", ctx.awayOn ? "turn_off" : "turn_on", ctx.ids.away);
      } else {
        this._call("climate", "set_preset_mode", ctx.ids.climate, { preset_mode: ctx.awayOn ? "none" : "away" });
      }
    });
    click("mode-room", () => this._call("select", "select_option", ctx.ids.mode, {
      option: optionFor(this._hass?.states?.[ctx.ids.mode], ROOM_OPTIONS),
    }));
    click("mode-water", () => this._call("select", "select_option", ctx.ids.mode, {
      option: optionFor(this._hass?.states?.[ctx.ids.mode], WATER_OPTIONS),
    }));
    const release = () => {
      if (!this._dragging) return;
      this._dragging = false;
      setTimeout(() => this._safeRender(), 0);
    };
    root.querySelectorAll("input[type=range]").forEach((input) => {
      input.addEventListener("pointerdown", () => { this._dragging = true; });
      input.addEventListener("pointerup", release);
      input.addEventListener("pointercancel", release);
      input.addEventListener("input", (event) => {
        const el = event.target;
        const label = el.closest(".slider-row")?.querySelector(".value");
        if (label) label.textContent = `${el.value}°`;
        el.style.setProperty("--pct", `${sliderPct(Number(el.value), Number(el.min), Number(el.max))}%`);
      });
      input.addEventListener("change", (event) => {
        const kind = event.target.dataset.slider;
        const entityId = kind === "water" ? ctx.ids.water : ctx.ids.dhw;
        this._call("number", "set_value", entityId, { value: Number(event.target.value) });
        release();
      });
    });
  }

  _escape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}

if (!customElements.get(CARD_TYPE)) {
  customElements.define(CARD_TYPE, NavienNr40dCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === CARD_TYPE)) {
  window.customCards.push({
    type: CARD_TYPE,
    name: "Navien NR-40D",
    description: "나비엔 NR-40D 보일러 카드",
    preview: false,
  });
}

console.info(`%c NAVIEN-NR40D-CARD %c ${CARD_VERSION} `, "background:#f97316;color:#fff;font-weight:700", "background:transparent;color:#f97316");
