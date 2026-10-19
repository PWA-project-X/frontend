import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProject, mediaUrl } from '../api/client'
import Header from '../components/header/Header'
import type { ProjectItem } from '../data/content'
import './projectDetailPage.css'
import './authPages.css'
import '../components/contactSection/style.css'

function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<ProjectItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false

    async function load() {
      try {
        const data = await getProject(id!)
        if (!cancelled) {
          setProject(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setProject(null)
          setError(
            err instanceof Error ? err.message : 'Falha ao carregar projeto',
          )
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
    <div className="app project-detail-page">
      <Header brand="Miniverso" />
      <main className="project-detail-main">
        <div className="project-detail-actions">
          <Link className="btn-nav" to="/#projetos">
            Voltar aos projetos
          </Link>
          <Link className="btn-nav" to="/">
            Portfólio
          </Link>
        </div>

        {!id ? (
          <p className="project-detail-error" role="alert">
            Projeto não encontrado
          </p>
        ) : null}

        {id && loading ? (
          <p className="project-detail-status" role="status">
            Carregando projeto…
          </p>
        ) : null}

        {error ? (
          <p className="project-detail-error" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && project ? (
          <article
            className="project-detail"
            aria-labelledby="project-detail-title"
          >
            {project.coverUrl ? (
              <img
                className="project-detail-cover"
                src={mediaUrl(project.coverUrl)}
                alt=""
              />
            ) : null}
            <p className="project-detail-category">{project.category}</p>
            <h1 id="project-detail-title">{project.title}</h1>
            <p className="project-detail-summary">{project.summary}</p>
            {project.technologies?.length ? (
              <ul className="project-detail-tech" aria-label="Tecnologias">
                {project.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            ) : null}
            <div className="project-detail-body">
              {project.description.split(/\n+/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
        ) : null}
      </main>
    </div>
  )
}

export default ProjectDetailPage
