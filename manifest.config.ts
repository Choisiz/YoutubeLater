import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: '__MSG_extName__',
  version: '1.1.0',
  description: '__MSG_extDescription__',
  default_locale: 'en',
  action: {
    default_popup: 'src/popup/index.html',
    default_icon: { '16': 'icons/icon16.png', '32': 'icons/icon32.png' },
  },
  background: { service_worker: 'src/background/index.ts', type: 'module' },
  content_scripts: [
    {
      matches: ['https://www.youtube.com/*'],
      js: ['src/content/index.ts'],
    },
  ],
  permissions: ['storage', 'contextMenus'],
  host_permissions: ['https://www.youtube.com/*'],
  icons: {
    '16': 'icons/icon16.png',
    '32': 'icons/icon32.png',
    '48': 'icons/icon48.png',
    '128': 'icons/icon128.png',
  },
})
