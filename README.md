# Navien NR-40D Home Assistant 커스텀 통합 구성요소

Home Assistant(HA)에서 경동나비엔 **NR-40D** Wi-Fi 온도조절기(룸콘) 및 지원 보일러(예: Navien Deluxe One 등)를 클라우드 서버 없이 **로컬 네트워크에서 직접 제어**할 수 있도록 구현된 통합 구성요소(Custom Component) 및 Lovelace 카드입니다.

---

## 목차
- [개요 및 특징](#개요-및-특징)
- [동작 원리](#동작-원리)
- [엔티티 구성](#엔티티-구성)
- [사전 요구 사항](#사전-요구-사항)
- [설치 및 설정 가이드](#설치-및-설정-가이드)
  - [1단계: Home Assistant 컴포넌트 설치](#1단계-home-assistant-컴포넌트-설치)
  - [2단계: 트래픽 리디렉션 (라우터 설정)](#2단계-트래픽-리디렉션-라우터-설정)
  - [3단계: Lovelace UI 카드 추가](#3단계-lovelace-ui-카드-추가)
- [문제 해결 및 팁](#문제-해결-및-팁)

---

## 개요 및 특징

- **100% 로컬 제어**: 외부 인터넷이 끊겨도 로컬 네트워크에서 완벽하게 작동
- **클라우드 비의존성**: 나비엔 공식 클라우드 서버 점검이나 장애 영향 없음
- **신속한 반응 속도**: 바이너리 패킷 직접 수발신으로 제어 지연 최소화
- **자체 전용 UI 제공**: 온도 조절 슬라이더 및 상태 아이콘이 포함된 커스텀 카드 내장

---

## 동작 원리

1. **NR-40D 통신 방식**: 
   - 조절기는 부팅 시 나비엔 클라우드 도메인(`rust2.naviensmartcontrol.com` 등)으로 접속을 시도합니다.
   - 통신 포트: 기본 포트 `TCP 7000`, 보조/확장 포트 `TCP 21000~21010`
   - 프로토콜: 체크섬 기반의 전용 바이너리 프레임 (별도의 SSL/TLS 암호화 및 서버 인증 없음)

2. **통합 구성요소 동작**:
   - Home Assistant 내부에 가상 나비엔 TCP 서버 데몬을 구동합니다.
   - 라우터(공유기)의 포트 포워딩(DNAT) 또는 DNS 리디렉션을 통해 조절기의 트래픽을 가로채 HA 서버로 유입시킵니다.
   - 조절기의 상태 패킷을 디코딩하여 HA 엔티티로 갱신하고, HA의 제어 명령을 바이너리 패킷으로 인코딩하여 응답합니다.

---

## 엔티티 구성

| 도메인 | 기본 명칭 | 설명 |
| :--- | :--- | :--- |
| `climate` | 보일러 (`kotel`) | 전원 On/Off, 현재 실내온도, 목표온도 설정, 외출(Away) 모드 |
| `switch` | 난방 전원 | 난방 운전 개별 켜기/끄기 |
| `switch` | 외출 모드 | 외출 절약 모드 활성화/비활성화 |
| `number` | 실내 희망온도 | 실내온도 난방 기준 설정값 ($10 \sim 40\ ^\circ\text{C}$, 1도 단위) |
| `number` | 난방수 희망온도 | 온돌/난방수 기준 설정값 ($40 \sim 80\ ^\circ\text{C}$) |
| `number` | 온수 희망온도 | 급탕/온수 설정값 ($30 \sim 60\ ^\circ\text{C}$) |
| `select` | 난방 제어 방식 | 실내온도 제어 vs 난방수(온돌) 제어 선택 |
| `sensor` | 실내 현재온도 | 룸콘 내장 센서 측정값 (차트/기록용) |
| `sensor` | 운전 상태 | 현재 보일러 운전 모드 상세 텍스트 |
| `sensor` | 고장/에러 코드 | 보일러 자체 에러 코드 및 상태 (예: E003, E302 등) |
| `binary_sensor` | 연소 표시기 | 보일러 버너 점화(Flame) 가동 여부 |
| `binary_sensor` | 룸콘 통신 연결 | HA 서버와 조절기 간의 TCP 연결 활성 상태 |
| `binary_sensor` | 외기온도 센서 | 외기 온도 센서 장착 및 인식 여부 |

> **참고**: 조절기 본체의 내부 시계 자동 동기화 기능이 함께 포함되어 있습니다.

---

## 사전 요구 사항

- **Home Assistant**: 2024.2.0 버전 이상
- **HACS (Home Assistant Community Store)**: 간편 설치 시 필요
- **패킷 제어 가능한 공유기**:
  - DNAT(포트 리디렉션) 지원 공유기 (MikroTik RouterOS, OpenWrt, pfSense, OPNsense, Asuswrt-Merlin 등)
  - 또는 로컬 DNS 재작성(DNS Spoofing) 지원 도구 (AdGuard Home, Pi-hole, dnsmasq 등)
- 조절기와 Home Assistant 서버는 동일한 로컬 네트워크(동일 서브넷 권장)에 위치해야 합니다.

---

## 설치 및 설정 가이드

### 1단계: Home Assistant 컴포넌트 설치

#### 방법 A: HACS를 통한 설치 (권장)
1. Home Assistant에서 **HACS** > **Integrations** 메뉴로 이동합니다.
2. 우측 상단 메뉴(점 3개)를 누르고 **Custom repositories**를 선택합니다.
3. 저장소 URL에 `https://github.com/ibuben/hass-navien-nr40d`를 입력하고, 카테고리를 `Integration`으로 지정하여 추가합니다.
4. 목록에서 **Navien NR-40D**를 검색하여 설치한 후, Home Assistant를 재시작합니다.

#### 방법 B: 수동 설치
1. 저장소의 `custom_components/navien_nr40d` 디렉터리를 다운로드합니다.
2. HA의 설정 디렉터리 내 `/config/custom_components/navien_nr40d` 위치에 복사합니다.
3. Home Assistant를 재시작합니다.

#### 기기 등록
1. HA 설정 > **기기 및 서비스** > **통합 구성요소 추가**를 클릭합니다.
2. **Navien NR-40D**를 검색하여 선택합니다.
3. 설정 창에서 파라미터를 입력합니다:
   - **Listen Address**: `0.0.0.0`
   - **TCP Ports**: `7000, 21001, 21002, 21003` (쉼표로 구분)
   - **Polling Interval**: `60` (기본값 권장, 단위: 초)
4. 저장을 완료합니다. *(아직 트래픽을 넘기지 않았으므로 '연결 끊김'으로 표시됩니다.)*

---

### 2단계: 트래픽 리디렉션 (라우터 설정)

공유기에서 조절기 IP에 대해 **고정 DHCP 임대(Static DHCP Lease)**를 먼저 설정하십시오.

#### 옵션 1: 포트 리디렉션 및 Hairpin NAT (가장 안정적)
조절기 IP에서 발생하는 TCP 포트 `7000`, `21000-21010` 대상 트래픽을 Home Assistant IP로 전달합니다.

* **MikroTik RouterOS 예시**  
  *(조절기 IP: `192.168.1.50`, HA 서버 IP: `192.168.1.10` 기준)*
  ```routeros
  /ip firewall nat
  add chain=dstnat src-address=192.168.1.50 protocol=tcp dst-port=7000,21000-21010 \
      action=dst-nat to-addresses=192.168.1.10 comment="Navien NR-40D -> HA"
  add chain=srcnat src-address=192.168.1.50 dst-address=192.168.1.10 protocol=tcp \
      dst-port=7000,21000-21010 action=masquerade comment="Navien NR-40D hairpin"
  ```

* **OpenWrt Firewall (`/etc/config/firewall`) 예시**
  ```uci
  config redirect
      option name 'Navien-NR40D-HA'
      option src 'lan'
      option src_ip '192.168.1.50'
      option src_dport '7000 21000-21010'
      option proto 'tcp'
      option dest 'lan'
      option dest_ip '192.168.1.10'
      option target 'DNAT'
  ```

#### 옵션 2: DNS 스푸핑 (DNS Redirection)
공유기 또는 로컬 DNS 서버(AdGuard Home, Pi-hole 등)에서 아래 호스트명의 IP를 **Home Assistant 서버의 로컬 IP**로 등록합니다.
- `rust2.naviensmartcontrol.com`
- `rust.naviensmartcontrol.com`
*(국내 정식 발매 모델 및 펌웨어에 따라 `krst2.naviensmartcontrol.com` 등으로 쿼리할 수 있으므로, DNS 질의 로그 확인을 권장합니다.)*

> **주의**: 도메인 리디렉션 후 조절기의 전원을 끄고 약 1분 뒤 다시 켜서 DNS 캐시를 갱신해 주어야 합니다.

---

### 3단계: Lovelace UI 카드 추가

1. 브라우저 캐시를 완전히 비우기 위해 Home Assistant 대시보드에서 `Ctrl + F5`를 누릅니다.
2. 대시보드 편집 모드로 진입한 후 **카드 추가**를 선택합니다.
3. 목록에서 **Navien NR-40D Card**(`custom:navien-nr40d-card`)를 선택합니다.
4. 등록된 보일러 기기 엔티티를 연결하면 전용 컨트롤러 카드가 구성됩니다.

```yaml
type: custom:navien-nr40d-card
entity: climate.kotel
name: 거실 보일러
```

---

## 문제 해결 및 팁

- **Docker/Container 환경 구동 시**:
  - Home Assistant 컨테이너가 `host` 네트워크 모드로 실행되어야 하거나, 포트 매핑(`-p 7000:7000 -p 21001-21003:21001-21003`)이 호스트에 명시적으로 열려 있어야 합니다.
- **연결 끊김(Unavailable) 지속 시**:
  - 공유기 방화벽의 Masquerade(Hairpin NAT) 규칙 누락 여부를 확인하십시오. 동일 L2/서브넷 내에서는 Hairpin NAT가 없으면 조절기가 TCP ACK 응답을 직접 수신하지 못해 세션이 성립되지 않습니다.
  - 조절기가 질의하는 정확한 포트와 도메인을 패킷 덤프(Wireshark/Router Torch) 또는 DNS 로그를 통해 재확인하십시오.
