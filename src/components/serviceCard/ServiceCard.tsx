import type { ServiceItem } from '../../data/content'
import './style.css'

type ServiceCardProps = {
  service: ServiceItem
}

function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="service-card">
      <h3 className="service-card-title">{service.title}</h3>
      <p className="service-card-description">{service.description}</p>
    </article>
  )
}

export default ServiceCard
