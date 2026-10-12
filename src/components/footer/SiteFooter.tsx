import { Link } from 'react-router-dom'
import './style.css'

type SiteFooterProps = {
  brand: string
  city: string
}

function SiteFooter({ brand, city }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-brand">{brand}</p>
        <nav className="site-footer-nav" aria-label="Rodapé">
          <Link to="/artigos">Blog</Link>
        </nav>
        <p className="site-footer-meta">{city}</p>
      </div>
    </footer>
  )
}

export default SiteFooter
