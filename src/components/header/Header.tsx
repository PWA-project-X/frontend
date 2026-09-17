import { useEffect, useState } from 'react'
import ButtonHome from '../buttonHome/ButtonHome'
import ButtonNext from '../buttonNext/ButtonNext'
import ButtonPrev from '../buttonPrev/ButtonPrev'
import { NAV_LINKS, SECTION_IDS } from '../../data/content'
import './style.css'

type HeaderProps = {
  brand: string
}

function Header({ brand }: HeaderProps) {
  const [activeId, setActiveId] = useState<string>(SECTION_IDS[0])

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    )

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.1, 0.35, 0.6],
      },
    )

    for (const section of sections) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <header className="topbar">
      <a href="#home" className="brand">
        {brand}
      </a>

      <nav className="nav-links" aria-label="Seções principais">
        {NAV_LINKS.map((link) => {
          const isActive = activeId === link.id
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav-link${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.label}
            </a>
          )
        })}
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
