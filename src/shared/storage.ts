import type { SavedVideo, VideoCandidate } from './types'

const VIDEOS_KEY = 'videos'

export async function getVideos(): Promise<SavedVideo[]> {
  const result = await chrome.storage.local.get(VIDEOS_KEY)
  return (result[VIDEOS_KEY] as SavedVideo[] | undefined) ?? []
}

/**
 * 최신 저장 순으로 맨 앞에 추가한다.
 * 이미 저장된 영상이면 저장하지 않고 duplicate: true를 돌려준다.
 */
export async function saveVideo(
  candidate: VideoCandidate,
): Promise<{ video: SavedVideo; duplicate: boolean }> {
  const videos = await getVideos()
  const existing = videos.find((v) => v.id === candidate.id)
  if (existing) return { video: existing, duplicate: true }

  const video: SavedVideo = { ...candidate, savedAt: Date.now() }
  await chrome.storage.local.set({ [VIDEOS_KEY]: [video, ...videos] })
  return { video, duplicate: false }
}

/** 저장 공간에서 영상을 삭제한다. */
export async function removeVideo(id: string): Promise<void> {
  const videos = await getVideos()
  await chrome.storage.local.set({ [VIDEOS_KEY]: videos.filter((v) => v.id !== id) })
}

/** 저장 목록이 바뀔 때마다 호출된다. 해제 함수를 돌려준다. */
export function onVideosChanged(callback: () => void): () => void {
  const listener = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
    if (area === 'local' && VIDEOS_KEY in changes) callback()
  }
  chrome.storage.onChanged.addListener(listener)
  return () => chrome.storage.onChanged.removeListener(listener)
}
