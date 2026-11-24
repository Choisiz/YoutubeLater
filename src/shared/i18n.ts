/** `_locales` 폴더의 messages.json에 있는 문구 키. 오타를 컴파일 단계에서 잡기 위해 목록으로 둔다. */
export type MessageKey =
  | 'contextMenuSave'
  | 'toastNotOnThumbnail'
  | 'toastDuplicate'
  | 'toastSaved'
  | 'countAll'
  | 'countFiltered'
  | 'themeToLight'
  | 'themeToDark'
  | 'searchPlaceholder'
  | 'sortLabel'
  | 'sortNewest'
  | 'sortOldest'
  | 'sortTitle'
  | 'loading'
  | 'emptyList'
  | 'emptyHint'
  | 'noResults'
  | 'watchTitle'
  | 'savedAt'
  | 'removeLabel'
  | 'removeTitle'
  | 'fallbackTitle'

/** 브라우저(UI) 언어에 맞는 문구를 돌려준다. 자리표시자는 순서대로 $1, $2... 에 들어간다. */
export function t(key: MessageKey, ...substitutions: string[]): string {
  return chrome.i18n.getMessage(key, substitutions)
}

/** 날짜·정렬에 쓰는 브라우저 언어 코드 (예: ko, en-US, ja, zh-CN) */
export function uiLanguage(): string {
  return chrome.i18n.getUILanguage()
}
