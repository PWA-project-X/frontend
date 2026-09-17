import type { ServiceItem } from '../../data/content'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import ServiceCard from '../serviceCard/ServiceCard'
import './style.css'

type ServicesSectionProps = {
  services: ServiceItem[]
}

function ServicesSection({ services }: ServicesSectionProps) {
  const ref = useRevealOnScroll<HTMLElement>()

  return (
    <section
      ref={ref}
      id="servicos"
      className="section section-servicos section-reveal"
      aria-labelledby="servicos-title"
    >
      <p className="section-number">03</p>
      <h2 id="servicos-title">Serviços</h2>
      <p className="section-intro">
        Áreas de atuação da Miniverso em experiências imersivas e educação.
      </p>
      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  )
}

export default ServicesSection
