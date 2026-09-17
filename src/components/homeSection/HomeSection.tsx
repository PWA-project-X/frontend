import type { CompanyInfo } from '../../data/content'
import './style.css'

type HomeSectionProps = {
  company: CompanyInfo
}

function HomeSection({ company }: HomeSectionProps) {
  return (
    <section id="home" className="section section-home" aria-labelledby="home-title">
      <p className="eyebrow">{company.city}</p>
      <h1 id="home-title">{company.project}</h1>
      <p className="lead">
        Espaço único para apresentar a {company.name}, seus serviços e o
        processo de trabalho — simples, responsivo e instalável como PWA.
      </p>
      <a className="cta-link" href="#sobre">
        Conhecer a empresa
      </a>
    </section>
  )
}

export default HomeSection
