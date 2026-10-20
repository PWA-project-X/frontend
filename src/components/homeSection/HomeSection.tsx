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
      <div className="section-inner home-inner">
        <img
          className="home-mark"
          src="/brand/logo-outline-white.png"
          alt=""
          aria-hidden="true"
          width={600}
          height={350}
          decoding="async"
        />
        <p className="section-number">01</p>
        <p className="eyebrow">{company.city}</p>
        <h1 id="home-title" className="home-title">
          <img
            className="home-logo"
            src="/brand/logo-white-horizontal.png"
            srcSet="/brand/logo-white-horizontal.png 1x, /brand/logo-white-horizontal@2x.png 2x"
            alt=""
            width={448}
            height={75}
            decoding="async"
          />
          <span className="visually-hidden">{company.name}</span>
        </h1>
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
