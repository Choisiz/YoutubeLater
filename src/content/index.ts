import type { ContextTargetMessage, ExtensionMessage } from '../shared/messages'
import { extractVideo } from './extractVideo'
import { showToast } from './toast'

// 우클릭할 때마다 그 위치의 영상 정보를 background에 알린다.
// (우클릭 메뉴 클릭 시점에는 어떤 썸네일이었는지 background가 알 수 없기 때문)
document.addEventListener(
  'contextmenu',
  (event) => {
    const message: ContextTargetMessage = {
      type: 'contextTarget',
      video: extractVideo(event.target),
    }
    chrome.runtime.sendMessage(message).catch(() => {
      // 확장이 다시 로드된 직후 등 연결이 끊긴 경우는 무시
    })
  },
  true,
)

chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
  if (message.type === 'toast') showToast(message.message)
})
