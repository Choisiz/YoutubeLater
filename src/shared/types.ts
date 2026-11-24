export interface SavedVideo {
  id: string
  title: string
  thumbnail: string
  url: string
  savedAt: number
}

/** 우클릭한 썸네일에서 추출한 영상 정보 (저장 전) */
export type VideoCandidate = Omit<SavedVideo, 'savedAt'>
