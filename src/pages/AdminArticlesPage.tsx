import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  adminDeleteInsight,
  adminListInsights,
  mediaUrl,
} from '../api/client'
import { useAuth } from '../auth/useAuth'
import Header from '../components/header/Header'
import type { ArticleItem } from '../data/content'
import './adminArticlesPage.css'
import './adminPage.css'
import './authPages.css'
import '../components/contactSection/style.css'

function AdminArticlesPage() {
  const { user } = useAuth()
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    void load()
  }, [load])

  const remove = async (id: string, title: string) => {
    if (!window.confirm(`Remover o artigo “${title}”?`)) return
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

  return (
    <div className="app admin-articles-page">
      <Header brand="Miniverso" />
      <main className="admin-articles-main">
        <div className="admin-articles-header">
          <div>
            <p className="section-number">Admin</p>
            <h1>Artigos</h1>
            <p className="auth-intro">
              Olá, {user?.name}. Publique conteúdo com texto, imagens e vídeos.
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

        {loading ? (
          <p className="articles-status" role="status">
            Carregando artigos…
          </p>
        ) : null}

        {!loading && articles.length === 0 ? (
          <p className="articles-status">Nenhum artigo ainda. Crie o primeiro.</p>
        ) : null}

        {!loading && articles.length > 0 ? (
          <ul className="admin-articles-list">
            {articles.map((item) => (
              <li key={item.id} className="admin-article-row">
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
                    {item.title}{' '}
                    <span className="admin-tag">{item.tag}</span>
                  </strong>
                  <p>{item.summary}</p>
                </div>
                <div className="admin-article-row-actions">
                  <Link className="btn-nav" to={`/admin/artigos/${item.id}`}>
                    Editar
                  </Link>
                  <Link className="btn-nav" to={`/artigos/${item.id}`}>
                    Ver
                  </Link>
                  <button
                    type="button"
                    className="btn-nav"
                    onClick={() => void remove(item.id, item.title)}
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </main>
    </div>
  )
}

export default AdminArticlesPage
