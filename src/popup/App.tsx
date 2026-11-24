import { useEffect, useMemo, useState } from 'react'
import { getVideos, onVideosChanged, removeVideo, setLanguage, setTheme } from '../shared/storage'
import type { Theme } from '../shared/storage'
import type { LanguageSetting, SavedVideo } from '../shared/types'
import { initI18n, LOCALES, t, uiLanguage } from '../shared/i18n'
import { applyTheme, isDark } from './theme'

type SortKey = 'newest' | 'oldest' | 'title'

const SORTERS: Record<SortKey, (a: SavedVideo, b: SavedVideo, lang: string) => number> = {
  newest: (a, b) => b.savedAt - a.savedAt,
  oldest: (a, b) => a.savedAt - b.savedAt,
  title: (a, b, lang) => a.title.localeCompare(b.title, lang),
}

function formatSavedAt(savedAt: number): string {
  return new Date(savedAt).toLocaleString(uiLanguage(), {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

export default function App({
  initialTheme,
  initialLanguage,
}: {
  initialTheme: Theme
  initialLanguage: LanguageSetting
}) {
  const [language, setLanguageState] = useState<LanguageSetting>(initialLanguage)
  const [theme, setThemeState] = useState<Theme>(initialTheme)
  const [videos, setVideos] = useState<SavedVideo[] | null>(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')

  useEffect(() => {
    const load = () => void getVideos().then(setVideos)
    load()
    return onVideosChanged(load)
  }, [])

  const lang = uiLanguage()
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (videos ?? [])
      .filter((v) => v.title.toLowerCase().includes(q))
      .sort((a, b) => SORTERS[sort](a, b, lang))
  }, [videos, query, sort, lang])

  // 클릭 = 시청 시작으로 보고, 새 탭에서 열면서 저장 공간에서 삭제한다.
  async function watch(video: SavedVideo) {
    await removeVideo(video.id)
    await chrome.tabs.create({ url: video.url })
  }

  // 지금 화면의 반대 테마로 바꾸고 선택을 저장한다.
  function toggleTheme() {
    const next: Theme = isDark(theme) ? 'light' : 'dark'
    setThemeState(next)
    applyTheme(next)
    void setTheme(next)
  }

  // 선택한 언어를 저장하고, 문구를 다시 불러온 뒤 화면을 갱신한다.
  async function changeLanguage(next: LanguageSetting) {
    await setLanguage(next)
    await initI18n()
    document.documentElement.lang = uiLanguage()
    setLanguageState(next)
  }

  const dark = isDark(theme)
  const total = videos?.length ?? 0

  return (
    <div className="app">
      <div className="header">
        <img src="/icons/icon48.png" alt="" />
        <h1>YouTubeLater</h1>
        {total > 0 && (
          <span className="count">
            {visible.length === total
              ? t('countAll', String(total))
              : t('countFiltered', String(visible.length), String(total))}
          </span>
        )}
        <select
          className="langSelect"
          value={language}
          onChange={(e) => void changeLanguage(e.target.value as LanguageSetting)}
          aria-label={t('languageLabel')}
          title={t('languageLabel')}
        >
          <option value="auto">{t('languageAuto')}</option>
          {LOCALES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
        <button
          className="themeToggle"
          onClick={toggleTheme}
          aria-label={t(dark ? 'themeToLight' : 'themeToDark')}
          title={t(dark ? 'themeToLight' : 'themeToDark')}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>

      {total > 0 && (
        <div className="toolbar">
          <input
            type="search"
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t('sortLabel')}>
            <option value="newest">{t('sortNewest')}</option>
            <option value="oldest">{t('sortOldest')}</option>
            <option value="title">{t('sortTitle')}</option>
          </select>
        </div>
      )}

      {videos === null && <p className="empty">{t('loading')}</p>}
      {videos !== null && total === 0 && (
        <p className="empty">
          {t('emptyList')}
          <br />
          {t('emptyHint')}
        </p>
      )}
      {total > 0 && visible.length === 0 && <p className="empty">{t('noResults')}</p>}

      <ul className="list">
        {visible.map((video) => (
          <li key={video.id} className="item">
            <button
              className="watch"
              onClick={() => void watch(video)}
              title={t('watchTitle')}
            >
              <img className="thumb" src={video.thumbnail} alt="" />
              <span className="info">
                <span className="title">{video.title}</span>
                <span className="date">{t('savedAt', formatSavedAt(video.savedAt))}</span>
              </span>
            </button>
            <button
              className="remove"
              onClick={() => void removeVideo(video.id)}
              aria-label={t('removeLabel')}
              title={t('removeTitle')}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
