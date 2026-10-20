import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  adminCreateInsight,
  adminGetCompany,
  adminListInsights,
  adminUpdateInsight,
  adminUploadImage,
  mediaUrl,
} from '../api/client'
import ArticleEditor from '../components/articleEditor/ArticleEditor'
import Header from '../components/header/Header'
import { confirmRemove } from '../utils/confirmRemove'
import './adminArticlesPage.css'
import './adminPage.css'
import './authPages.css'
import '../components/contactSection/style.css'

function isEmptyHtml(html: string) {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim()
  return text.length === 0
}

function AdminArticleEditPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id || id === 'novo'
  const navigate = useNavigate()
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [brand, setBrand] = useState('Miniverso')
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('')
  const [summary, setSummary] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [body, setBody] = useState('<p></p>')
  const [editorKey, setEditorKey] = useState(() =>
    isNew ? 'novo' : `loading-${id}`,
  )
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    void adminGetCompany()
      .then((company) => setBrand(company.name))
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    if (isNew) return
    let cancelled = false

    async function load() {
      try {
        const list = await adminListInsights()
        const article = list.find((item) => item.id === id)
        if (!article) {
          if (!cancelled) setError('Artigo não encontrado')
          return
        }
        if (cancelled) return
        setTitle(article.title)
        setTag(article.tag)
        setSummary(article.summary)
        setCoverUrl(article.coverUrl || '')
        setBody(article.body || '<p></p>')
        setEditorKey(`${article.id}-${article.createdAt}`)
        setError(null)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [id, isNew])

  const uploadCover = async (file: File | undefined) => {
    if (!file) return
    setUploadingCover(true)
    setError(null)
    try {
      const url = await adminUploadImage(file)
      setCoverUrl(url)
      setMessage('Capa enviada')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no upload da capa')
    } finally {
      setUploadingCover(false)
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isEmptyHtml(body)) {
      setError('Escreva o texto do artigo')
      return
    }
    setSaving(true)
    setError(null)
    setMessage(null)
    const payload = {
      title: title.trim(),
      tag: tag.trim(),
      summary: summary.trim(),
      body,
      coverUrl,
    }
    try {
      if (isNew) {
        const created = await adminCreateInsight(payload)
        setMessage('Artigo criado')
        navigate(`/admin/artigos/${created.id}`, { replace: true })
      } else {
        await adminUpdateInsight(id!, payload)
        setMessage('Artigo atualizado')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app admin-articles-page">
      <Header brand={brand} />
      <main className="admin-articles-main">
        <div className="admin-articles-header">
          <div>
            <p className="section-number">Admin</p>
            <h1>{isNew ? 'Novo artigo' : 'Editar artigo'}</h1>
            <p className="auth-intro">
              Título, resumo e capa para a prévia. O editor aceita texto,
              imagens e vídeos do YouTube/Vimeo.
            </p>
          </div>
          <div className="admin-articles-actions">
            <Link className="btn-nav" to="/admin/artigos">
              Voltar à lista
            </Link>
            {!isNew ? (
              <Link className="btn-nav" to={`/artigos/${id}`}>
                Ver publicado
              </Link>
            ) : null}
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
            Carregando…
          </p>
        ) : (
          <form className="admin-article-form" onSubmit={handleSubmit}>
            <div className="contact-form admin-form">
              <label className="contact-field">
                <span>Título</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>
              <label className="contact-field">
                <span>Tag</span>
                <input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  required
                />
              </label>
              <label className="contact-field contact-field-full">
                <span>Resumo</span>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  required
                />
              </label>
              <div className="contact-field contact-field-full admin-cover-field">
                <span>Capa (opcional)</span>
                {coverUrl ? (
                  <img
                    className="admin-cover-preview"
                    src={mediaUrl(coverUrl)}
                    alt="Prévia da capa"
                  />
                ) : null}
                <div className="admin-cover-actions">
                  <button
                    type="button"
                    className="btn-nav"
                    disabled={uploadingCover}
                    onClick={() => coverInputRef.current?.click()}
                  >
                    {uploadingCover
                      ? 'Enviando…'
                      : coverUrl
                        ? 'Trocar capa'
                        : 'Enviar capa'}
                  </button>
                  {coverUrl ? (
                    <button
                      type="button"
                      className="btn-nav"
                      onClick={() => {
                        if (!confirmRemove('a capa')) return
                        setCoverUrl('')
                      }}
                    >
                      Remover capa
                    </button>
                  ) : null}
                </div>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  hidden
                  onChange={(e) => void uploadCover(e.target.files?.[0])}
                />
              </div>
            </div>

            <div className="contact-field contact-field-full">
              <span>Texto do artigo</span>
              <ArticleEditor
                value={body}
                contentKey={editorKey}
                onChange={setBody}
                disabled={saving}
              />
            </div>

            <div className="admin-articles-actions">
              <button
                type="submit"
                className="contact-submit"
                disabled={saving}
              >
                {saving ? 'Salvando…' : 'Salvar artigo'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}

export default AdminArticleEditPage
