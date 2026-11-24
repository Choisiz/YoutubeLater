const TOAST_ID = 'youtubeLater-toast'
const DURATION_MS = 2000

export function showToast(message: string): void {
  document.getElementById(TOAST_ID)?.remove()

  const el = document.createElement('div')
  el.id = TOAST_ID
  el.textContent = message
  Object.assign(el.style, {
    position: 'fixed',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px 18px',
    borderRadius: '8px',
    background: 'rgba(33, 33, 33, 0.95)',
    color: '#fff',
    fontSize: '14px',
    zIndex: '2147483647',
    pointerEvents: 'none',
  })
  document.body.appendChild(el)
  setTimeout(() => el.remove(), DURATION_MS)
}
