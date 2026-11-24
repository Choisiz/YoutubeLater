export interface SavedVideo {
  id: string
  title: string
  thumbnail: string
  url: string
  savedAt: number
}

/** 우클릭한 썸네일에서 추출한 영상 정보 (저장 전) */
export type VideoCandidate = Omit<SavedVideo, 'savedAt'>

/** 지원하는 화면 언어. `_locales` 폴더 이름과 같다. */
export type Locale = 'ko' | 'en' | 'ja' | 'zh_CN'

/** 'auto'면 브라우저 언어를 따른다. */
export type LanguageSetting = 'auto' | Locale
