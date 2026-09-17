import type { ProjectItem } from '../../data/content'
import './style.css'

type ProjectCardProps = {
  project: ProjectItem
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <p className="project-card-category">{project.category}</p>
      <h3 className="project-card-title">{project.title}</h3>
      <p className="project-card-summary">{project.summary}</p>
    </article>
  )
}

export default ProjectCard
