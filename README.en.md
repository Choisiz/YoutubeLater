<div align="center">

<img src="public/icons/icon128.png" alt="YouTubeLater icon" width="96" height="96" />

# YouTubeLater

**Save YouTube videos for later with a single right-click, kept separate from your watch history.**

English · [한국어](README.md) · [Changelog](CHANGELOG.md) · [Privacy Policy](PRIVACY.md)

[![release](https://img.shields.io/github/v/release/Choisiz/YoutubeLater?color=e53935)](https://github.com/Choisiz/YoutubeLater/releases)
![Chrome](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)

</div>

---

## Why?

| Problem | How YouTubeLater helps |
| --- | --- |
| Videos you watched and videos you meant to watch **get mixed in your watch history** | Saved videos are kept **completely separate** from YouTube's watch history |
| Videos you meant to watch later are **hard to find again** | See them all in the popup, with title **search and sorting** |
| YouTube's "Watch later" takes **too many steps to save** | **Right-click a thumbnail, click one menu item**, done |

## Features

- 🖱️ **Right-click to save** — right-click a YouTube thumbnail and choose "Save to watch later"
- 🔔 **Save feedback** — a toast confirms the video was saved
- 🗂️ **Saved list** — click the toolbar icon to see thumbnails, titles and saved dates
- ▶️ **Click to play** — clicking a video opens it in a new tab and removes it from the list
- ✕ **Delete without watching** — the ✕ button appears when you hover an item
- ♻️ **No duplicates** — a video that is already saved is not saved twice
- 🔍 **Search and sort** — search titles; sort by newest, oldest or title
- 🌐 **Multilingual** — 한국어, English, 日本語, 简体中文. Follows your browser language, and you can pick one in the popup
- 🌙 **Dark mode** — switch between light and dark with the button in the popup (your choice is remembered)

## How to use

1. On YouTube, **right-click the thumbnail** of a video you want to watch later.
2. Click **"Save to watch later"**.
3. Click the **YouTubeLater icon** in the Chrome toolbar to see your saved videos.
4. Click a video to play it in a new tab; it is removed from the list.
5. Use the selector at the top of the popup to change the **language**, and the moon/sun button to switch **light/dark mode**.

## Install

YouTubeLater is not on the Chrome Web Store yet. Install it as an unpacked extension.

### From a release

1. Download the latest `YouTubeLater-v*.zip` from [Releases](https://github.com/Choisiz/YoutubeLater/releases) and unzip it.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the unzipped folder.

### Build from source

```bash
git clone https://github.com/Choisiz/YoutubeLater.git
cd YoutubeLater
npm install
npm run build
```

Then load the generated `dist/` folder the same way.

## Development

| Command | Description |
| --- | --- |
| `npm run dev` | Development mode (generates `dist/`, hot reload) |
| `npm run build` | Production build |
| `npm run lint` | Lint (oxlint) |

### Tech stack

- Chrome Extension **Manifest V3**
- **TypeScript** + **React** (popup UI)
- **Vite** + **CRXJS**
- Storage: `chrome.storage.local` — your data stays in your browser and is never sent to a server.

### Project structure

```text
src/
├─ background/   service worker (context menu, saving)
├─ content/      script injected into YouTube (thumbnail detection, toast)
├─ popup/        toolbar popup UI (list, search, sort, language and theme)
└─ shared/       types, storage, i18n, messages
public/icons/    extension icons
public/_locales/ translations (ko, en, ja, zh_CN)
```

## Known limitations

- **Desktop Chrome only.** Mobile is not supported.
- If YouTube changes its page structure, video info may not be read from a thumbnail. If you see a fallback title such as `YouTube video (ID)`, please open an [issue](https://github.com/Choisiz/YoutubeLater/issues).
- Clicking a video in the list **removes it immediately**. This cannot be undone.
- The extension name and description shown in `chrome://extensions` follow the browser language, not the in-popup language setting.

## Roadmap

- [ ] Watched state / separating "watched" from "to watch"
- [ ] Mobile support (PWA share target, etc.)
- [ ] Server sync

## Privacy

Saved video information is stored only in your browser (`chrome.storage.local`) and is never transmitted. See the [Privacy Policy](PRIVACY.md).

## License

[MIT License](LICENSE) © 2026 Choisiz
