import type { ExtensionMessage, ToastMessage } from '../shared/messages'
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
      title: '나중에 볼 영상에 저장',
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
    notify(tab.id, '영상 썸네일 위에서 우클릭해 주세요')
    return
  }

  const { duplicate } = await saveVideo(video)
  notify(tab.id, duplicate ? `이미 저장된 영상입니다: ${video.title}` : `저장했습니다: ${video.title}`)
})
