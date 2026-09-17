import type { CompanyInfo } from '../../data/content'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import './style.css'

type AboutSectionProps = {
  company: CompanyInfo
}

function AboutSection({ company }: AboutSectionProps) {
  const ref = useRevealOnScroll<HTMLElement>()

  return (
    <section
      ref={ref}
      id="sobre"
      className="section section-sobre section-reveal"
      aria-labelledby="sobre-title"
    >
      <p className="section-number">02</p>
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
