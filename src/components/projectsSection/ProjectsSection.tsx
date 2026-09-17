import type { ProjectItem } from '../../data/content'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import ProjectCard from '../projectCard/ProjectCard'
import './style.css'

type ProjectsSectionProps = {
  projects: ProjectItem[]
}

function ProjectsSection({ projects }: ProjectsSectionProps) {
  const ref = useRevealOnScroll<HTMLElement>()

  return (
    <section
      ref={ref}
      id="projetos"
      className="section section-projetos section-reveal"
      aria-labelledby="projetos-title"
    >
      <p className="section-number">04</p>
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
