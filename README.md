<div align="center">

<img src="public/icons/icon128.png" alt="youtubeLater 아이콘" width="96" height="96" />

# youtubeLater

**유튜브에서 나중에 볼 영상을, 우클릭 한 번으로 시청 기록과 분리해 저장하세요.**

![version](https://img.shields.io/badge/version-1.0.0-e53935)
![Chrome](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)

</div>

---

## 왜 만들었나요?

| 문제 | youtubeLater의 해결 |
| --- | --- |
| 실제로 본 영상과 나중에 볼 영상이 **시청 기록에 뒤섞인다** | 저장한 영상은 유튜브 시청 기록과 **완전히 분리**해 따로 보관 |
| 나중에 보려던 영상을 **다시 찾기 어렵다** | 팝업에서 한눈에 보고, 제목 **검색·정렬** 지원 |
| 유튜브 '나중에 볼 동영상'은 **저장 과정이 번거롭다** | 썸네일 **우클릭 → 메뉴 한 번 클릭**으로 끝 |

## 주요 기능

- 🖱️ **우클릭 저장** — 유튜브 썸네일을 우클릭해 "나중에 볼 영상에 저장"을 누르면 끝
- 🔔 **저장 피드백** — 저장되면 화면 아래에 토스트로 알려줌
- 🗂️ **저장 목록** — 툴바 아이콘을 누르면 썸네일, 제목, 저장 날짜가 담긴 목록 표시
- ▶️ **클릭하면 재생** — 목록에서 영상을 누르면 새 탭에서 재생하고, 본 영상은 목록에서 자동 삭제
- ✕ **보지 않고 삭제** — 항목에 마우스를 올리면 나타나는 ✕ 버튼
- ♻️ **중복 방지** — 이미 저장한 영상은 다시 저장하지 않음
- 🔍 **검색·정렬** — 제목 검색, 최신순 / 오래된순 / 제목순
- 🌙 **다크 모드** — 시스템 설정을 따라감

## 사용 방법

1. 유튜브(`youtube.com`)에서 나중에 볼 영상의 **썸네일을 우클릭**합니다.
2. **"나중에 볼 영상에 저장"** 을 클릭합니다.
3. 크롬 툴바의 **youtubeLater 아이콘**을 눌러 저장한 영상을 확인합니다.
4. 영상을 클릭하면 새 탭에서 재생되고 목록에서 사라집니다.

## 설치

아직 Chrome 웹 스토어에는 등록되어 있지 않아, 압축해제된 확장 프로그램으로 설치합니다.

### 릴리스 파일로 설치

1. [Releases](https://github.com/Choisiz/YoutubeLater/releases)에서 최신 `youtubeLater-v*.zip`을 받아 압축을 풉니다.
2. 크롬에서 `chrome://extensions`를 엽니다.
3. 우측 상단 **개발자 모드**를 켭니다.
4. **압축해제된 확장 프로그램을 로드합니다**를 누르고 압축 푼 폴더를 선택합니다.

### 소스에서 빌드

```bash
git clone https://github.com/Choisiz/YoutubeLater.git
cd YoutubeLater
npm install
npm run build
```

빌드 후 생성된 `dist/` 폴더를 위와 같은 방법으로 크롬에 로드합니다.

## 개발

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 모드 (`dist/` 생성, 핫 리로드) |
| `npm run build` | 배포용 빌드 |
| `npm run lint` | 린트 (oxlint) |

### 기술 스택

- Chrome Extension **Manifest V3**
- **TypeScript** + **React** (팝업 UI)
- **Vite** + **CRXJS**
- 저장소: `chrome.storage.local` — 데이터는 내 브라우저에만 저장되며 서버로 전송되지 않습니다.

### 폴더 구조

```text
src/
├─ background/   서비스 워커 (우클릭 메뉴, 저장 처리)
├─ content/      유튜브 페이지에 주입되는 스크립트 (썸네일 감지, 토스트)
├─ popup/        툴바 팝업 UI (목록, 검색, 정렬)
└─ shared/       타입, 저장소, 메시지 정의
public/icons/    확장 아이콘
```

## 알려진 제한

- **데스크톱 크롬 전용**입니다. 모바일은 지원하지 않습니다.
- 유튜브 화면 구조가 바뀌면 썸네일에서 영상 정보를 읽지 못할 수 있습니다. 제목이 `YouTube 영상 (ID)`처럼 보이면 [이슈](https://github.com/Choisiz/YoutubeLater/issues)로 알려 주세요.
- 목록에서 영상을 **클릭하면 곧바로 삭제**됩니다. 되돌릴 수 없습니다.

## 로드맵

- [ ] 시청 완료 처리 / 보기 상태 구분
- [ ] 모바일 대응 (PWA 공유 기능 등)
- [ ] 서버 동기화
