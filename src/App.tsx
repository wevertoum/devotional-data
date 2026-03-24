import Fuse from 'fuse.js'
import { useMemo, useState } from 'react'
import rootData from '../devotional-database.json'
import { normalizeSearchText } from './lib/normalize'
import type { CheckIn, Root } from './types/devotional'

const root = rootData as Root

function getSortTime(c: CheckIn): number {
  const t = Date.parse(c.occurred_at)
  if (!Number.isNaN(t)) return t
  const t2 = Date.parse(c.created_at)
  if (!Number.isNaN(t2)) return t2
  return 0
}

function imageUrl(c: CheckIn): string | undefined {
  const media = c.check_in_media?.[0]?.url
  if (typeof media === 'string' && media) return media
  if (c.photo_url) return c.photo_url
  return undefined
}

const dateFmt = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeStyle: 'short',
})

type DateSortOrder = 'asc' | 'desc'

export default function App() {
  const [titleQuery, setTitleQuery] = useState('')
  const [contentQuery, setContentQuery] = useState('')
  const [dateSortOrder, setDateSortOrder] = useState<DateSortOrder>('asc')

  const sortedCheckIns = useMemo(() => {
    const list = [...root.check_ins]
    const cmp = (a: CheckIn, b: CheckIn) => getSortTime(a) - getSortTime(b)
    list.sort(dateSortOrder === 'asc' ? cmp : (a, b) => -cmp(a, b))
    return list
  }, [dateSortOrder])

  const fuseTitle = useMemo(
    () =>
      new Fuse(sortedCheckIns, {
        keys: [
          {
            name: 'title',
            getFn: (item: CheckIn) => normalizeSearchText(item.title),
          },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [sortedCheckIns],
  )

  const fuseContent = useMemo(
    () =>
      new Fuse(sortedCheckIns, {
        keys: [
          {
            name: 'description',
            getFn: (item: CheckIn) =>
              normalizeSearchText(item.description ?? ''),
          },
        ],
        threshold: 0.45,
        ignoreLocation: true,
      }),
    [sortedCheckIns],
  )

  const filtered = useMemo(() => {
    let list = sortedCheckIns
    const tq = normalizeSearchText(titleQuery)
    const cq = normalizeSearchText(contentQuery)
    if (tq) {
      const ids = new Set(fuseTitle.search(tq).map((r) => r.item.id))
      list = list.filter((c) => ids.has(c.id))
    }
    if (cq) {
      const ids = new Set(fuseContent.search(cq).map((r) => r.item.id))
      list = list.filter((c) => ids.has(c.id))
    }
    return list
  }, [sortedCheckIns, titleQuery, contentQuery, fuseTitle, fuseContent])

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="border-b border-stone-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:gap-6">
          {root.photo_url ? (
            <img
              src={root.photo_url}
              alt=""
              className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-stone-200"
            />
          ) : null}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-800">
              {root.name}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {sortedCheckIns.length} devocionais —{' '}
              {dateSortOrder === 'asc'
                ? 'do mais antigo ao mais novo'
                : 'do mais novo ao mais antigo'}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6 flex flex-col gap-4">
          <label className="flex w-full max-w-xs flex-col gap-1.5 text-sm font-medium text-stone-700">
            Ordem da lista
            <select
              value={dateSortOrder}
              onChange={(e) =>
                setDateSortOrder(e.target.value as DateSortOrder)
              }
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-400"
            >
              <option value="asc">Mais antigo primeiro</option>
              <option value="desc">Mais novo primeiro</option>
            </select>
          </label>
          <div className="flex flex-col gap-4 sm:flex-row">
          <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-stone-700">
            Buscar no título
            <input
              type="search"
              value={titleQuery}
              onChange={(e) => setTitleQuery(e.target.value)}
              placeholder="Ex.: juizes 15"
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm outline-none ring-stone-400 placeholder:text-stone-400 focus:border-stone-400 focus:ring-2"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-stone-700">
            Buscar no conteúdo
            <input
              type="search"
              value={contentQuery}
              onChange={(e) => setContentQuery(e.target.value)}
              placeholder="Palavras no texto..."
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm outline-none ring-stone-400 placeholder:text-stone-400 focus:border-stone-400 focus:ring-2"
            />
          </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 bg-white px-4 py-8 text-center text-stone-500">
            Nenhum devocional encontrado com os filtros atuais.
          </p>
        ) : (
          <ul className="flex flex-col gap-5">
            {filtered.map((c) => {
              const img = imageUrl(c)
              const when = dateFmt.format(new Date(getSortTime(c)))
              return (
                <li
                  key={c.id}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row">
                    {img ? (
                      <div className="aspect-video w-full shrink-0 sm:aspect-auto sm:h-auto sm:w-44">
                        <img
                          src={img}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5">
                      <time
                        dateTime={c.occurred_at}
                        className="text-xs font-medium uppercase tracking-wide text-stone-500"
                      >
                        {when}
                      </time>
                      <h2 className="text-lg font-semibold text-stone-800">
                        {c.title}
                      </h2>
                      {c.description ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                          {c.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>
    </div>
  )
}
