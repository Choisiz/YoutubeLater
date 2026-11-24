import type { ExtensionMessage, ToastMessage } from '../shared/messages'
import { t } from '../shared/i18n'
import { saveVideo } from '../shared/storage'
import type { VideoCandidate } from '../shared/types'

const MENU_ID = 'saveForLater'

// 서비스 워커는 수시로 종료되므로 우클릭 대상은 메모리가 아닌 session storage에 둔다.
const targetKey = (tabId: number) => `contextTarget:${tabId}`

chrome.runtime.onInstalled.addListener(() => {
  // 확장을 다시 로드할 때 중복 생성 오류를 막기 위해 먼저 비운다.
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: t('contextMenuSave'),
      contexts: ['all'],
      documentUrlPatterns: ['https://www.youtube.com/*'],
    })
  })
})

chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender) => {
  const tabId = sender.tab?.id
  if (message.type !== 'contextTarget' || tabId === undefined) return

  if (message.video) {
    void chrome.storage.session.set({ [targetKey(tabId)]: message.video })
  } else {
    void chrome.storage.session.remove(targetKey(tabId))
  }
})

function notify(tabId: number, message: string) {
  const toast: ToastMessage = { type: 'toast', message }
  chrome.tabs.sendMessage(tabId, toast).catch(() => {
    // content script가 없는 탭이면 무시
  })
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID || tab?.id === undefined) return

  const key = targetKey(tab.id)
  const stored = await chrome.storage.session.get(key)
  const video = stored[key] as VideoCandidate | undefined

  if (!video) {
    notify(tab.id, t('toastNotOnThumbnail'))
    return
  }

  const { duplicate } = await saveVideo(video)
  notify(tab.id, t(duplicate ? 'toastDuplicate' : 'toastSaved', video.title))
})
