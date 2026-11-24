import type { VideoCandidate } from '../shared/types'

const VIDEO_LINK = 'a[href*="/watch?v="], a[href^="/shorts/"], a[href*="youtube.com/shorts/"]'

// 유튜브의 영상 카드 컨테이너 (구버전/신버전 레이아웃 모두)
const CARD_SELECTOR = [
  'ytd-rich-item-renderer',
  'ytd-video-renderer',
  'ytd-compact-video-renderer',
  'ytd-grid-video-renderer',
  'ytd-playlist-video-renderer',
  'yt-lockup-view-model',
].join(', ')

const TITLE_SELECTOR = '#video-title, .yt-lockup-metadata-view-model__title, h3'

const VIDEO_ID_PATTERN = /^[\w-]{11}$/

export function parseVideoId(href: string): string | null {
  let url: URL
  try {
    url = new URL(href, location.origin)
  } catch {
    return null
  }
  const id = url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/shorts\/([^/?]+)/)?.[1]
  return id && VIDEO_ID_PATTERN.test(id) ? id : null
}

function findVideoLink(target: Element): { link: HTMLAnchorElement; card: Element | null } | null {
  const card = target.closest(CARD_SELECTOR)

  const direct = target.closest<HTMLAnchorElement>(VIDEO_LINK)
  if (direct) return { link: direct, card }

  // 썸네일 위 오버레이 등 링크 바깥을 클릭한 경우, 카드 안의 첫 영상 링크를 사용
  const inCard = card?.querySelector<HTMLAnchorElement>(VIDEO_LINK)
  return inCard ? { link: inCard, card } : null
}

function extractTitle(link: HTMLAnchorElement, card: Element | null, id: string): string {
  const fromCard = card?.querySelector(TITLE_SELECTOR)?.textContent?.trim()
  if (fromCard) return fromCard
  const fromLink = link.getAttribute('title') ?? link.getAttribute('aria-label')
  if (fromLink?.trim()) return fromLink.trim()
  return `YouTube 영상 (${id})`
}

/** 우클릭한 요소가 영상 썸네일(카드)이면 영상 정보를 반환하고, 아니면 null. */
export function extractVideo(target: EventTarget | null): VideoCandidate | null {
  if (!(target instanceof Element)) return null

  const found = findVideoLink(target)
  if (!found) return null

  const id = parseVideoId(found.link.getAttribute('href') ?? '')
  if (!id) return null

  return {
    id,
    title: extractTitle(found.link, found.card, id),
    thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${id}`,
  }
}
