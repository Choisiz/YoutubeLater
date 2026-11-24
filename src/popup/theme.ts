import type { Theme } from '../shared/storage'

/** 선택한 테마를 문서에 적용한다. 'system'이면 속성을 지워 시스템 설정을 따른다. */
export function applyTheme(theme: Theme): void {
  if (theme === 'system') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = theme
}

/** 지금 화면이 실제로 어두운지 (선택값 또는 시스템 설정 기준) */
export function isDark(theme: Theme): boolean {
  if (theme === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches
  return theme === 'dark'
}
