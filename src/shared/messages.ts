import type { VideoCandidate } from './types'

/** content → background: 우클릭한 위치의 영상 정보 (썸네일이 아니면 null) */
export interface ContextTargetMessage {
  type: 'contextTarget'
  video: VideoCandidate | null
}

/** background → content: 화면에 토스트 표시 */
export interface ToastMessage {
  type: 'toast'
  message: string
}

export type ExtensionMessage = ContextTargetMessage | ToastMessage
