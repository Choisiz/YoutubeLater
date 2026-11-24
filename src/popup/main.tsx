import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getTheme } from '../shared/storage'
import App from './App'
import './popup.css'
import { applyTheme } from './theme'

// 첫 화면이 라이트로 번쩍이지 않도록 테마를 적용한 뒤 렌더링한다.
document.documentElement.lang = chrome.i18n.getUILanguage()

void getTheme().then((theme) => {
  applyTheme(theme)
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App initialTheme={theme} />
    </StrictMode>,
  )
})
