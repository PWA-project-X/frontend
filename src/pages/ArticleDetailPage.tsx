import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getArticle, mediaUrl } from '../api/client'
import Header from '../components/header/Header'
import type { ArticleItem } from '../data/content'
import { sanitizeArticleHtml } from '../utils/sanitizeArticleHtml'
import './articlesPage.css'
import './authPages.css'
import '../components/contactSection/style.css'

function formatDate(value: string) {
  const date = new Date(value.includes('T') ? value : `${value}Z`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<ArticleItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false

    async function load() {
      try {
        const data = await getArticle(id!)
        if (!cancelled) {
          setArticle(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setArticle(null)
          setError(err instanceof Error ? err.message : 'Falha ao carregar artigo')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="app articles-page">
      <Header brand="Miniverso" />
      <main className="articles-main">
        <div className="article-detail-actions">
          <Link className="btn-nav" to="/artigos">
            Voltar aos artigos
          </Link>
          <Link className="btn-nav" to="/">
            Portfólio
          </Link>
        </div>

        {!id ? (
          <p className="articles-error" role="alert">
            Artigo não encontrado
          </p>
        ) : null}

        {id && loading ? (
          <p className="articles-status" role="status">
            Carregando artigo…
          </p>
        ) : null}

        {error ? (
          <p className="articles-error" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && article ? (
          <article className="article-detail" aria-labelledby="article-title">
            {article.coverUrl ? (
              <img
                className="article-detail-cover"
                src={mediaUrl(article.coverUrl)}
                alt=""
              />
            ) : null}
            <p className="article-detail-tag">{article.tag}</p>
            <h1 id="article-title">{article.title}</h1>
            <p className="article-detail-summary">{article.summary}</p>
            <p className="article-detail-meta">
              Publicado em {formatDate(article.createdAt)}
            </p>
            <div
              className="article-detail-body article-detail-body-html"
              dangerouslySetInnerHTML={{
                __html: sanitizeArticleHtml(article.body),
              }}
            />
          </article>
        ) : null}
      </main>
    </div>
  )
}

export default ArticleDetailPage
