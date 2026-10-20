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
        <p className="site-footer-brand">
          <img
            className="site-footer-logo"
            src="/brand/logo-white-horizontal.png"
            srcSet="/brand/logo-white-horizontal.png 1x, /brand/logo-white-horizontal@2x.png 2x"
            alt={brand}
            width={140}
            height={23}
            decoding="async"
          />
        </p>
        <nav className="site-footer-nav" aria-label="Rodapé">
          <Link to="/artigos">Blog</Link>
        </nav>
        <p className="site-footer-meta">{city}</p>
      </div>
    </footer>
  )
}

export default SiteFooter
