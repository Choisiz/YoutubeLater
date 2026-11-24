import { useEffect, useMemo, useState } from 'react'
import { getVideos, onVideosChanged, removeVideo } from '../shared/storage'
import type { SavedVideo } from '../shared/types'

type SortKey = 'newest' | 'oldest' | 'title'

const SORTERS: Record<SortKey, (a: SavedVideo, b: SavedVideo) => number> = {
  newest: (a, b) => b.savedAt - a.savedAt,
  oldest: (a, b) => a.savedAt - b.savedAt,
  title: (a, b) => a.title.localeCompare(b.title, 'ko'),
}

function formatSavedAt(savedAt: number): string {
  return new Date(savedAt).toLocaleString('ko-KR', {
    month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

export default function App() {
  const [videos, setVideos] = useState<SavedVideo[] | null>(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')

  useEffect(() => {
    const load = () => void getVideos().then(setVideos)
    load()
    return onVideosChanged(load)
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (videos ?? [])
      .filter((v) => v.title.toLowerCase().includes(q))
      .sort(SORTERS[sort])
  }, [videos, query, sort])

  // 클릭 = 시청 시작으로 보고, 새 탭에서 열면서 저장 공간에서 삭제한다.
  async function watch(video: SavedVideo) {
    await removeVideo(video.id)
    await chrome.tabs.create({ url: video.url })
  }

  const total = videos?.length ?? 0

  return (
    <div className="app">
      <div className="header">
        <img src="/icons/icon48.png" alt="" />
        <h1>YouTubeLater</h1>
        {total > 0 && (
          <span className="count">
            {visible.length === total ? `${total}개` : `${visible.length} / ${total}개`}
          </span>
        )}
      </div>

      {total > 0 && (
        <div className="toolbar">
          <input
            type="search"
            placeholder="제목 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="정렬">
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="title">제목순</option>
          </select>
        </div>
      )}

      {videos === null && <p className="empty">불러오는 중...</p>}
      {videos !== null && total === 0 && (
        <p className="empty">저장한 영상이 없습니다.<br />유튜브 썸네일을 우클릭해 저장해 보세요.</p>
      )}
      {total > 0 && visible.length === 0 && <p className="empty">검색 결과가 없습니다.</p>}

      <ul className="list">
        {visible.map((video) => (
          <li key={video.id} className="item">
            <button
              className="watch"
              onClick={() => void watch(video)}
              title="클릭하면 새 탭에서 재생하고 목록에서 삭제됩니다"
            >
              <img className="thumb" src={video.thumbnail} alt="" />
              <span className="info">
                <span className="title">{video.title}</span>
                <span className="date">{formatSavedAt(video.savedAt)} 저장</span>
              </span>
            </button>
            <button
              className="remove"
              onClick={() => void removeVideo(video.id)}
              aria-label="삭제"
              title="보지 않고 삭제"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
