import type { ServiceItem } from '../../data/content'
import ServiceCard from '../serviceCard/ServiceCard'
import './style.css'

type ServicesSectionProps = {
  services: ServiceItem[]
}

function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section
      id="servicos"
      className="section section-servicos"
      aria-labelledby="servicos-title"
    >
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
