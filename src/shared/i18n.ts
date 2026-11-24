import { getLanguage } from './storage'
import type { LanguageSetting, Locale } from './types'

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
  | 'languageLabel'
  | 'languageAuto'

/** 언어 선택 목록. 이름은 번역하지 않고 각 언어 자신의 이름으로 보여준다. */
export const LOCALES: readonly { code: Locale; label: string; tag: string }[] = [
  { code: 'ko', label: '한국어', tag: 'ko' },
  { code: 'en', label: 'English', tag: 'en' },
  { code: 'ja', label: '日本語', tag: 'ja' },
  { code: 'zh_CN', label: '简体中文', tag: 'zh-CN' },
]

interface MessageEntry {
  message: string
  placeholders?: Record<string, { content: string }>
}
type Messages = Record<string, MessageEntry>

// 크롬 기본 i18n(chrome.i18n.getMessage)은 실행 중에 언어를 바꿀 수 없어서,
// 선택한 언어의 messages.json을 직접 불러와 쓴다.
const cache = new Map<Locale, Messages>()
let current: Locale = 'en'
let currentMessages: Messages = {}
let fallbackMessages: Messages = {}

/** 'auto'이면 브라우저 언어에서 지원하는 언어를 고르고, 없으면 영어. */
export function resolveLocale(setting: LanguageSetting): Locale {
  if (setting !== 'auto') return setting
  const lang = chrome.i18n.getUILanguage().toLowerCase()
  if (lang.startsWith('ko')) return 'ko'
  if (lang.startsWith('ja')) return 'ja'
  if (lang.startsWith('zh')) return 'zh_CN'
  return 'en'
}

async function loadMessages(locale: Locale): Promise<Messages> {
  const cached = cache.get(locale)
  if (cached) return cached
  const response = await fetch(chrome.runtime.getURL(`_locales/${locale}/messages.json`))
  const messages = (await response.json()) as Messages
  cache.set(locale, messages)
  return messages
}

/** 저장된 언어 설정을 읽어 문구를 준비한다. 화면을 그리기 전에 호출해야 한다. */
export async function initI18n(): Promise<Locale> {
  const locale = resolveLocale(await getLanguage())
  const [messages, fallback] = await Promise.all([loadMessages(locale), loadMessages('en')])
  current = locale
  currentMessages = messages
  fallbackMessages = fallback
  return locale
}

/** 현재 언어의 문구를 돌려준다. 자리표시자는 순서대로 $1, $2...에 들어간다. */
export function t(key: MessageKey, ...substitutions: string[]): string {
  const entry = currentMessages[key] ?? fallbackMessages[key]
  if (!entry) return key
  return entry.message.replace(/\$(\w+)\$/g, (_whole, name: string) => {
    const content = entry.placeholders?.[name.toLowerCase()]?.content
    const index = content ? Number(content.slice(1)) - 1 : -1
    return substitutions[index] ?? ''
  })
}

/** 날짜·정렬에 쓰는 현재 화면 언어 코드 (예: ko, en, ja, zh-CN) */
export function uiLanguage(): string {
  return LOCALES.find((l) => l.code === current)?.tag ?? 'en'
}
