import { Link } from 'react-router-dom'
import { mediaUrl } from '../../api/client'
import type { ProjectItem } from '../../data/content'
import './style.css'

type ProjectCardProps = {
  project: ProjectItem
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      {project.coverUrl ? (
        <img
          className="project-card-cover"
          src={mediaUrl(project.coverUrl)}
          alt=""
        />
      ) : null}
      <p className="project-card-category">{project.category}</p>
      <h3 className="project-card-title">{project.title}</h3>
      <p className="project-card-summary">{project.summary}</p>
      {project.technologies?.length ? (
        <ul className="project-tech-list" aria-label="Tecnologias">
          {project.technologies.map((tech) => (
            <li key={tech} className="project-tech-chip">
              {tech}
            </li>
          ))}
        </ul>
      ) : null}
      <Link className="btn-nav project-card-link" to={`/projetos/${project.id}`}>
        Ver detalhes
      </Link>
    </article>
  )
}

export default ProjectCard
