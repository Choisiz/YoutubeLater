import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'youtubeLater',
  version: '0.0.1',
  description: '유튜브 영상을 시청 기록과 분리해 나중에 볼 목록으로 저장합니다.',
  action: { default_popup: 'src/popup/index.html' },
  background: { service_worker: 'src/background/index.ts', type: 'module' },
  content_scripts: [
    {
      matches: ['https://www.youtube.com/*'],
      js: ['src/content/index.ts'],
    },
  ],
  permissions: ['storage', 'contextMenus'],
  host_permissions: ['https://www.youtube.com/*'],
  icons: { '128': 'icons/icon128.png' },
})
