import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initI18n, uiLanguage } from '../shared/i18n'
import { getLanguage, getTheme } from '../shared/storage'
import App from './App'
import './popup.css'
import { applyTheme } from './theme'

// 첫 화면이 다른 테마·언어로 번쩍이지 않도록, 저장된 설정을 적용한 뒤 렌더링한다.
void Promise.all([getTheme(), getLanguage(), initI18n()]).then(([theme, language]) => {
  applyTheme(theme)
  document.documentElement.lang = uiLanguage()
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App initialTheme={theme} initialLanguage={language} />
    </StrictMode>,
  )
})
