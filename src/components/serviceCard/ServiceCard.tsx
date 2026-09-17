import type { ServiceItem } from '../../data/content'
import './style.css'

type ServiceCardProps = {
  service: ServiceItem
  index: number
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const label = String(index).padStart(2, '0')

  return (
    <article className="service-card">
      <p className="service-card-index" aria-hidden="true">
        /{label}
      </p>
      <h3 className="service-card-title">{service.title}</h3>
      <p className="service-card-description">{service.description}</p>
    </article>
  )
}

export default ServiceCard
