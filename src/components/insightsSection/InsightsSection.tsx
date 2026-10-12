import { Link } from 'react-router-dom'
import { mediaUrl } from '../../api/client'
import type { InsightItem } from '../../data/content'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import './style.css'

type InsightsSectionProps = {
  insights: InsightItem[]
}

function InsightsSection({ insights }: InsightsSectionProps) {
  const ref = useRevealOnScroll<HTMLElement>()
  const [featured, ...rest] = insights

  return (
    <section
      ref={ref}
      id="insights"
      className="section section-insights section-with-grid section-reveal"
      aria-labelledby="insights-title"
    >
      <div className="section-inner section-inner-wide">
        <p className="section-number">06</p>
        <h2 id="insights-title">Blog</h2>
        <p className="section-intro">
          Artigos sobre RV, RA, conteúdo 3D e inovação — abertos para leitura.
        </p>

        {insights.length === 0 ? (
          <p className="insights-empty">Nenhum artigo publicado ainda.</p>
        ) : null}

        {featured ? (
          <Link
            to={`/artigos/${featured.id}`}
            className="insight-featured insight-card-link"
          >
            {featured.coverUrl ? (
              <img
                className="insight-featured-cover"
                src={mediaUrl(featured.coverUrl)}
                alt=""
              />
            ) : null}
            <div className="insight-featured-body">
              <p className="insight-card-tag">{featured.tag}</p>
              <h3 className="insight-featured-title">{featured.title}</h3>
              <p className="insight-card-summary">{featured.summary}</p>
              <span className="insight-card-cta">Ler artigo</span>
            </div>
          </Link>
        ) : null}

        {rest.length > 0 ? (
          <div className="insights-grid">
            {rest.map((insight) => (
              <Link
                key={insight.id}
                to={`/artigos/${insight.id}`}
                className="insight-card insight-card-link"
              >
                {insight.coverUrl ? (
                  <img
                    className="insight-card-cover"
                    src={mediaUrl(insight.coverUrl)}
                    alt=""
                  />
                ) : null}
                <p className="insight-card-tag">{insight.tag}</p>
                <h3 className="insight-card-title">{insight.title}</h3>
                <p className="insight-card-summary">{insight.summary}</p>
                <span className="insight-card-cta">Ler artigo</span>
              </Link>
            ))}
          </div>
        ) : null}

        {insights.length > 0 ? (
          <p className="insights-all">
            <Link to="/artigos">Ver todos os artigos</Link>
          </p>
        ) : null}
      </div>
    </section>
  )
}

export default InsightsSection
