import { insightsFallback } from '../../data/content'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import './style.css'

function InsightsSection() {
  const ref = useRevealOnScroll<HTMLElement>()

  return (
    <section
      ref={ref}
      id="insights"
      className="section section-insights section-with-grid section-reveal"
      aria-labelledby="insights-title"
    >
      <div className="section-inner section-inner-wide">
        <p className="section-number">06</p>
        <h2 id="insights-title">Insights</h2>
        <p className="section-intro">
          Artigos e notas curtas sobre RV, RA, conteúdo 3D e inovação — estrutura
          visual para a v1, sem CMS.
        </p>
        <div className="insights-grid">
          {insightsFallback.map((insight) => (
            <article key={insight.id} className="insight-card">
              <p className="insight-card-tag">{insight.tag}</p>
              <h3 className="insight-card-title">{insight.title}</h3>
              <p className="insight-card-summary">{insight.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default InsightsSection
