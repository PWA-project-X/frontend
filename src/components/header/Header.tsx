import ButtonHome from '../buttonHome/ButtonHome'
import ButtonNext from '../buttonNext/ButtonNext'
import ButtonPrev from '../buttonPrev/ButtonPrev'
import { NAV_LINKS, SECTION_IDS } from '../../data/content'
import './style.css'

type HeaderProps = {
  brand: string
}

function Header({ brand }: HeaderProps) {
  return (
    <header className="topbar">
      <a href="#home" className="brand">
        {brand}
      </a>

      <nav className="nav-links" aria-label="Seções principais">
        {NAV_LINKS.map((link) => (
          <a key={link.id} href={`#${link.id}`} className="nav-link">
            {link.label}
          </a>
        ))}
      </nav>

      <nav className="nav-actions" aria-label="Atalhos de navegação">
        <ButtonHome targetId="home" />
        <ButtonPrev sectionIds={[...SECTION_IDS]} />
        <ButtonNext sectionIds={[...SECTION_IDS]} />
      </nav>
    </header>
  )
}

export default Header
