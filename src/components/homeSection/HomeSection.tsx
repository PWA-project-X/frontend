import type { CompanyInfo } from '../../data/content'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import './style.css'

type HomeSectionProps = {
  company: CompanyInfo
}

function HomeSection({ company }: HomeSectionProps) {
  const ref = useRevealOnScroll<HTMLElement>()

  return (
    <section
      ref={ref}
      id="home"
      className="section section-home section-reveal"
      aria-labelledby="home-title"
    >
      <div className="home-glow" aria-hidden="true" />
      <div className="section-inner home-inner">
        <p className="section-number">01</p>
        <p className="eyebrow">{company.city}</p>
        <h1 id="home-title">{company.name}</h1>
        <p className="hero-subtitle">{company.project}</p>
        <p className="lead">
          Espaço único para apresentar a empresa, seus serviços e o processo de
          trabalho — simples, responsivo e instalável como PWA.
        </p>
        <a className="cta-link" href="#servicos">
          Ver serviços
        </a>
      </div>
    </section>
  )
}

export default HomeSection
