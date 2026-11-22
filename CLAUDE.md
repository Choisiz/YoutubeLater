# youtubeLater

## 프로젝트 개요
- 프로젝트명: youtubeLater
- 경로: /Users/cky/dev/youtubeLater
- 설명: 유튜브 추천 영상 중 나중에 시청하고 싶은 영상을 최소한의 조작으로 저장하고, 실제 시청 기록과 분리하여 관리하는 서비스

## 해결하려는 문제
- 실제 시청한 영상과 나중에 볼 영상이 시청 기록에 혼재한다.
- 나중에 보려고 했던 영상을 다시 찾기 어렵다.
- 유튜브의 '나중에 볼 동영상' 기능은 별도로 저장하는 과정이 번거롭다.

## 핵심 해결 방안
- 유튜브 썸네일에서 마우스 우클릭만으로 영상을 별도 저장하는 기능을 제공한다.
- 저장한 영상은 유튜브 시청 기록과 분리하여 관리한다.

## 기술 스택
- 형태: 크롬 확장 프로그램 (Manifest V3), 데스크톱 전용
- 언어: TypeScript (`@types/chrome` 사용)
- 빌드: Vite + CRXJS 플러그인
- UI(팝업/보관함): React
- 저장소: `chrome.storage.local` (이후 필요 시 서버 추가)
- 모바일: 확장 미지원. 추후 공유 기능(PWA Web Share Target 등)으로 대체 검토

## 명령어
- 설치: `npm install`
- 개발 실행: `npm run dev` (`dist/`에 확장 생성, 핫 리로드)
- 빌드: `npm run build` (`dist/`에 배포용 결과물 생성)
- 린트: `npm run lint` (oxlint)
- 테스트: (작성 예정)

## 크롬에 로드하는 방법 (개발용)
1. `chrome://extensions` 접속
2. 우측 상단 개발자 모드 켜기
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `/Users/cky/dev/youtubeLater/dist` 폴더 선택
- `manifest.json`을 수정하면 `chrome://extensions`에서 새로고침 버튼을 눌러야 할 수 있다.

## 배포
- `dist/`를 zip으로 묶어 Chrome 웹 스토어 개발자 대시보드에 업로드한다. (등록비 1회 $5, 심사 있음)
- 개인 사용 목적이면 배포 없이 압축해제 로드로 충분하다.

## 코드 컨벤션
- 폴더명은 카멜표기법(camelCase)을 사용한다.
- 응답과 커뮤니케이션은 한국어로 한다.

## 디렉터리 구조
- `manifest.config.ts`: 확장 매니페스트 정의 (MV3)
- `vite.config.ts`: Vite + React + CRXJS 설정
- `src/popup/`: 툴바 팝업 UI (React)
- `src/background/`: 서비스 워커 (우클릭 메뉴, 저장 처리)
- `src/content/`: 유튜브 페이지에 주입되는 콘텐츠 스크립트 (썸네일 감지)
- `public/icons/`: 확장 아이콘 (현재 임시 단색 이미지)
- `dist/`: 빌드 결과물 (크롬에 로드하는 폴더, git 제외)
