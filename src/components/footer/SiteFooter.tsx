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
        <p className="site-footer-meta">{city}</p>
      </div>
    </footer>
  )
}

export default SiteFooter
