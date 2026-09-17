import type { ProjectItem } from '../../data/content'
import ProjectCard from '../projectCard/ProjectCard'
import './style.css'

type ProjectsSectionProps = {
  projects: ProjectItem[]
}

function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section
      id="projetos"
      className="section section-projetos"
      aria-labelledby="projetos-title"
    >
      <h2 id="projetos-title">Projetos</h2>
      <p className="section-intro">
        Exemplos de experiências e simulações alinhadas ao trabalho da Miniverso.
      </p>
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}

export default ProjectsSection
