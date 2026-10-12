import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getArticles, mediaUrl } from '../api/client'
import Header from '../components/header/Header'
import type { ArticleItem } from '../data/content'
import './articlesPage.css'
import './authPages.css'
import '../components/contactSection/style.css'

function formatDate(value: string) {
  const date = new Date(value.includes('T') ? value : `${value}Z`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await getArticles()
        if (!cancelled) {
          setArticles(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar artigos')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const [featured, ...rest] = articles

  return (
    <div className="app articles-page">
      <Header brand="Miniverso" />
      <main className="articles-main articles-main-wide">
        <header className="articles-header">
          <p className="section-number">Blog</p>
          <h1>Artigos</h1>
          <p className="articles-intro">
            Conteúdo sobre RV, RA, conteúdo 3D e inovação. Aberto para leitura
            sem conta.
          </p>
        </header>

        {loading ? (
          <p className="articles-status" role="status">
            Carregando artigos…
          </p>
        ) : null}

        {error ? (
          <p className="articles-error" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && !error && articles.length === 0 ? (
          <p className="articles-status">Nenhum artigo publicado ainda.</p>
        ) : null}

        {!loading && !error && featured ? (
          <>
            <Link
              className="article-featured-link"
              to={`/artigos/${featured.id}`}
            >
              {featured.coverUrl ? (
                <img
                  className="article-featured-cover"
                  src={mediaUrl(featured.coverUrl)}
                  alt=""
                />
              ) : null}
              <div className="article-featured-body">
                <p className="article-card-tag">{featured.tag}</p>
                <h2 className="article-featured-title">{featured.title}</h2>
                <p className="article-card-summary">{featured.summary}</p>
                <p className="article-card-meta">
                  {formatDate(featured.createdAt)}
                </p>
              </div>
            </Link>

            {rest.length > 0 ? (
              <ul className="articles-list articles-list-grid">
                {rest.map((article) => (
                  <li key={article.id} className="articles-list-item">
                    <Link
                      className="article-card-link"
                      to={`/artigos/${article.id}`}
                    >
                      {article.coverUrl ? (
                        <img
                          className="article-card-cover"
                          src={mediaUrl(article.coverUrl)}
                          alt=""
                        />
                      ) : null}
                      <p className="article-card-tag">{article.tag}</p>
                      <h2 className="article-card-title">{article.title}</h2>
                      <p className="article-card-summary">{article.summary}</p>
                      <p className="article-card-meta">
                        {formatDate(article.createdAt)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  )
}

export default ArticlesPage
