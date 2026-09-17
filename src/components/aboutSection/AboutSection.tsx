import type { CompanyInfo } from '../../data/content'
import './style.css'

type AboutSectionProps = {
  company: CompanyInfo
}

function AboutSection({ company }: AboutSectionProps) {
  return (
    <section id="sobre" className="section section-sobre" aria-labelledby="sobre-title">
      <h2 id="sobre-title">Sobre</h2>
      <p>{company.description}</p>
      <p>{company.proposal}</p>
      <p className="about-meta">
        Projeto: <strong>{company.project}</strong> · {company.city}
      </p>
    </section>
  )
}

export default AboutSection
