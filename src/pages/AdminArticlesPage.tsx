import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import {
  adminDeleteInsight,
  adminListInsights,
  adminReorderHomeInsights,
  adminUpdateInsightPlacement,
  mediaUrl,
} from '../api/client'
import { useAuth } from '../auth/useAuth'
import Header from '../components/header/Header'
import type { ArticleItem } from '../data/content'
import { confirmRemove } from '../utils/confirmRemove'
import './adminArticlesPage.css'
import './adminPage.css'
import './authPages.css'
import '../components/contactSection/style.css'

type ArticleFilter = 'published' | 'home' | 'archived'

const HOME_LIMIT = 6

function ActionIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="admin-action-svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

const icons = {
  grip: (
    <ActionIcon>
      <circle cx="9" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1" fill="currentColor" stroke="none" />
    </ActionIcon>
  ),
  archive: (
    <ActionIcon>
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
      <path d="M10 12h4" />
    </ActionIcon>
  ),
  restore: (
    <ActionIcon>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </ActionIcon>
  ),
  edit: (
    <ActionIcon>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </ActionIcon>
  ),
  view: (
    <ActionIcon>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </ActionIcon>
  ),
  remove: (
    <ActionIcon>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </ActionIcon>
  ),
}

type ArticleRowProps = {
  item: ArticleItem
  onHome: boolean
  homeIndex: number
  homeCount: number
  busy: boolean
  dragDisabled?: boolean
  style?: CSSProperties
  setNodeRef?: (node: HTMLElement | null) => void
  isDragging?: boolean
  dragHandleProps?: Record<string, unknown>
  onSetPlacement: (
    id: string,
    data: { showOnHome?: boolean; archived?: boolean },
    okMessage: string,
  ) => void
  onRemove: (id: string, title: string) => void
}

function ArticleRow({
  item,
  onHome,
  homeIndex,
  homeCount,
  busy,
  dragDisabled,
  style,
  setNodeRef,
  isDragging,
  dragHandleProps,
  onSetPlacement,
  onRemove,
}: ArticleRowProps) {
  const rowClass = [
    'admin-article-row',
    item.archived ? 'admin-article-row-archived' : '',
    onHome ? 'admin-article-row-home' : '',
    isDragging ? 'admin-article-row-dragging' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li ref={setNodeRef} className={rowClass} style={style}>
      {onHome ? (
        <button
          type="button"
          className="admin-drag-handle"
          title="Arrastar para reordenar"
          aria-label={`Arrastar ${item.title}`}
          disabled={busy || dragDisabled}
          {...dragHandleProps}
        >
          {icons.grip}
        </button>
      ) : !item.archived ? (
        <button
          type="button"
          className="admin-drag-handle"
          title="Marque “Na home” para poder reordenar"
          aria-label={`${item.title}: marque Na home para reordenar`}
          disabled
        >
          {icons.grip}
        </button>
      ) : (
        <span className="admin-drag-handle-spacer" aria-hidden="true" />
      )}
      {item.coverUrl ? (
        <img
          className="admin-article-cover"
          src={mediaUrl(item.coverUrl)}
          alt=""
        />
      ) : (
        <div className="admin-article-cover-empty">Sem capa</div>
      )}
      <div className="admin-article-meta">
        <strong>
          {item.title} <span className="admin-tag">{item.tag}</span>
          {onHome ? (
            <span className="admin-tag admin-tag-home">
              Home #{homeIndex + 1}
            </span>
          ) : null}
          {item.archived ? (
            <span className="admin-tag admin-tag-archived">Arquivado</span>
          ) : null}
        </strong>
        <p>{item.summary}</p>
        {!item.archived ? (
          <label className="admin-home-check">
            <input
              type="checkbox"
              checked={onHome}
              disabled={busy || (!onHome && homeCount >= HOME_LIMIT)}
              onChange={(event) => {
                onSetPlacement(
                  item.id,
                  { showOnHome: event.target.checked },
                  event.target.checked
                    ? 'Artigo adicionado à home'
                    : 'Artigo removido da home',
                )
              }}
            />
            <span>Na home</span>
          </label>
        ) : null}
      </div>
      <div className="admin-article-row-actions">
        {item.archived ? (
          <button
            type="button"
            className="admin-action-btn"
            title="Restaurar"
            aria-label="Restaurar"
            disabled={busy}
            onClick={() =>
              onSetPlacement(
                item.id,
                { archived: false },
                'Artigo restaurado',
              )
            }
          >
            {icons.restore}
          </button>
        ) : (
          <button
            type="button"
            className="admin-action-btn"
            title="Arquivar"
            aria-label="Arquivar"
            disabled={busy}
            onClick={() =>
              onSetPlacement(item.id, { archived: true }, 'Artigo arquivado')
            }
          >
            {icons.archive}
          </button>
        )}
        <Link
          className="admin-action-btn"
          to={`/admin/artigos/${item.id}`}
          title="Editar"
          aria-label="Editar"
        >
          {icons.edit}
        </Link>
        {!item.archived ? (
          <Link
            className="admin-action-btn"
            to={`/artigos/${item.id}`}
            title="Ver"
            aria-label="Ver"
          >
            {icons.view}
          </Link>
        ) : null}
        <button
          type="button"
          className="admin-action-btn admin-action-btn-danger"
          title="Remover"
          aria-label="Remover"
          disabled={busy}
          onClick={() => onRemove(item.id, item.title)}
        >
          {icons.remove}
        </button>
      </div>
    </li>
  )
}

function SortableArticleRow(props: ArticleRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.item.id,
    disabled: props.busy || props.dragDisabled,
  })

  const style: CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <ArticleRow
      {...props}
      setNodeRef={setNodeRef}
      style={style}
      isDragging={isDragging}
      dragHandleProps={{ ...attributes, ...listeners }}
    />
  )
}

function AdminArticlesPage() {
  const { user } = useAuth()
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [filter, setFilter] = useState<ArticleFilter>('published')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const load = useCallback(async () => {
    try {
      setArticles(await adminListInsights())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar artigos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadArticles() {
      try {
        const data = await adminListInsights()
        if (!cancelled) {
          setArticles(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Falha ao carregar artigos',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadArticles()
    return () => {
      cancelled = true
    }
  }, [])

  const homeArticles = useMemo(
    () =>
      articles
        .filter((item) => item.showOnHome && !item.archived)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [articles],
  )

  const homeCount = homeArticles.length
  const homeIds = useMemo(
    () => homeArticles.map((item) => item.id),
    [homeArticles],
  )
  const canDragHome = filter !== 'archived' && homeIds.length > 1

  const visibleArticles = useMemo(() => {
    if (filter === 'archived') {
      return articles.filter((item) => item.archived)
    }
    if (filter === 'home') {
      return homeArticles
    }
    return articles.filter((item) => !item.archived)
  }, [articles, filter, homeArticles])

  const remove = async (id: string, title: string) => {
    if (!confirmRemove(`o artigo “${title}”`)) return
    try {
      await adminDeleteInsight(id)
      setMessage('Artigo removido')
      setError(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao remover')
      setMessage(null)
    }
  }

  const setPlacement = async (
    id: string,
    data: { showOnHome?: boolean; archived?: boolean },
    okMessage: string,
  ) => {
    setBusyId(id)
    try {
      await adminUpdateInsightPlacement(id, data)
      setMessage(okMessage)
      setError(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar')
      setMessage(null)
    } finally {
      setBusyId(null)
    }
  }

  const applyHomeOrder = (ids: string[]) => {
    setArticles((prev) =>
      prev.map((item) => {
        const index = ids.indexOf(item.id)
        if (index === -1) return item
        return { ...item, sortOrder: index + 1, showOnHome: true }
      }),
    )
  }

  const reorderHome = async (ids: string[]) => {
    const previous = articles
    applyHomeOrder(ids)
    setBusyId('reorder')
    try {
      await adminReorderHomeInsights(ids)
      setMessage('Ordem da home atualizada')
      setError(null)
      await load()
    } catch (err) {
      setArticles(previous)
      setError(err instanceof Error ? err.message : 'Falha ao reordenar')
      setMessage(null)
    } finally {
      setBusyId(null)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || busyId) return

    const oldIndex = homeArticles.findIndex((item) => item.id === active.id)
    const newIndex = homeArticles.findIndex((item) => item.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    const ids = arrayMove(
      homeArticles.map((item) => item.id),
      oldIndex,
      newIndex,
    )
    void reorderHome(ids)
  }

  const listContent =
    !loading && visibleArticles.length > 0 ? (
      <ul className="admin-articles-list">
        {visibleArticles.map((item) => {
          const onHome = Boolean(item.showOnHome) && !item.archived
          const homeIndex = onHome
            ? homeArticles.findIndex((home) => home.id === item.id)
            : -1
          const busy = busyId === item.id || busyId === 'reorder'
          const rowProps: ArticleRowProps = {
            item,
            onHome,
            homeIndex,
            homeCount,
            busy,
            dragDisabled: !canDragHome,
            onSetPlacement: (id, data, okMessage) => {
              void setPlacement(id, data, okMessage)
            },
            onRemove: (id, title) => {
              void remove(id, title)
            },
          }

          if (onHome && filter !== 'archived') {
            return <SortableArticleRow key={item.id} {...rowProps} />
          }

          return <ArticleRow key={item.id} {...rowProps} />
        })}
      </ul>
    ) : null

  return (
    <div className="app admin-articles-page">
      <Header brand="Miniverso" />
      <main className="admin-articles-main">
        <div className="admin-articles-header">
          <div>
            <p className="section-number">Admin</p>
            <h1>Artigos</h1>
            <p className="auth-intro">
              Olá, {user?.name}. Escolha quais artigos aparecem na home, a ordem
              e arquive o que não deve ficar público.
            </p>
          </div>
          <div className="admin-articles-actions">
            <Link className="contact-submit auth-link-btn" to="/admin/artigos/novo">
              Novo artigo
            </Link>
            <Link className="btn-nav" to="/admin">
              Painel
            </Link>
            <Link className="btn-nav" to="/artigos">
              Ver feed
            </Link>
          </div>
        </div>

        {message ? (
          <p className="admin-flash" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="admin-error" role="alert">
            {error}
          </p>
        ) : null}

        {!loading ? (
          <p
            className={
              homeCount >= HOME_LIMIT ? 'admin-home-warn' : 'admin-home-status'
            }
            role="status"
          >
            {homeCount} de {HOME_LIMIT} artigos na home
            {homeCount >= HOME_LIMIT
              ? ' — limite atingido. Remova um para adicionar outro.'
              : '.'}
          </p>
        ) : null}

        <div className="admin-articles-filters" role="tablist" aria-label="Filtro">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'published'}
            className={
              filter === 'published'
                ? 'admin-filter-btn admin-filter-btn-active'
                : 'admin-filter-btn'
            }
            onClick={() => setFilter('published')}
          >
            Publicados
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'home'}
            className={
              filter === 'home'
                ? 'admin-filter-btn admin-filter-btn-active'
                : 'admin-filter-btn'
            }
            onClick={() => setFilter('home')}
          >
            Na home
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'archived'}
            className={
              filter === 'archived'
                ? 'admin-filter-btn admin-filter-btn-active'
                : 'admin-filter-btn'
            }
            onClick={() => setFilter('archived')}
          >
            Arquivados
          </button>
        </div>

        {loading ? (
          <p className="articles-status" role="status">
            Carregando artigos…
          </p>
        ) : null}

        {!loading && visibleArticles.length === 0 ? (
          <p className="articles-status">
            {filter === 'archived'
              ? 'Nenhum artigo arquivado.'
              : filter === 'home'
                ? 'Nenhum artigo na home ainda.'
                : 'Nenhum artigo ainda. Crie o primeiro.'}
          </p>
        ) : null}

        {listContent && filter !== 'archived' ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={homeIds}
              strategy={verticalListSortingStrategy}
            >
              {listContent}
            </SortableContext>
          </DndContext>
        ) : (
          listContent
        )}
      </main>
    </div>
  )
}

export default AdminArticlesPage
