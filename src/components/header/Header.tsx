import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { NAV_LINKS, SECTION_IDS } from '../../data/content'
import './style.css'

const TOPBAR_MINIMIZED_KEY = 'topbar-minimized'

type HeaderProps = {
  brand: string
  showSectionNav?: boolean
}

function Header({ brand, showSectionNav = false }: HeaderProps) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [activeId, setActiveId] = useState<string>(SECTION_IDS[0])
  const [minimized, setMinimized] = useState(() => {
    try {
      return sessionStorage.getItem(TOPBAR_MINIMIZED_KEY) === '1'
    } catch {
      return false
    }
  })
  const onPortfolio = location.pathname === '/'
  const onBlog = location.pathname.startsWith('/artigos')

  useEffect(() => {
    try {
      sessionStorage.setItem(TOPBAR_MINIMIZED_KEY, minimized ? '1' : '0')
    } catch {
      /* ignore storage errors */
    }
  }, [minimized])

  useEffect(() => {
    if (!showSectionNav || !onPortfolio) return

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
  }, [showSectionNav, onPortfolio])

  const toggleMinimized = () => {
    setMinimized((current) => !current)
  }

  return (
    <header className={`topbar${minimized ? ' is-minimized' : ''}`}>
      <div className="topbar-main">
        {showSectionNav && onPortfolio ? (
          <nav className="nav-links" aria-label="Seções principais" hidden={minimized}>
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
        ) : null}
      </div>

      <div className="topbar-center">
        <button
          type="button"
          className="topbar-toggle"
          aria-expanded={!minimized}
          onClick={toggleMinimized}
        >
          <span className="visually-hidden">
            {minimized ? 'Expandir menu' : 'Minimizar menu'}
          </span>
          <span className="topbar-toggle-icon" aria-hidden="true" />
        </button>
        <Link
          to="/"
          className={`topbar-title${onPortfolio && !minimized ? ' is-active' : ''}`}
          aria-current={onPortfolio && !minimized ? 'page' : undefined}
        >
          <img
            className="topbar-logo"
            src="/brand/logo-white-horizontal.png"
            srcSet="/brand/logo-white-horizontal.png 1x, /brand/logo-white-horizontal@2x.png 2x"
            alt=""
            width={168}
            height={28}
            decoding="async"
          />
          <span className="visually-hidden">{brand}</span>
        </Link>
      </div>

      <nav className="nav-actions" aria-label="Conta e atalhos" hidden={minimized}>
        <Link
          className={`btn-nav${onBlog ? ' is-active' : ''}`}
          to="/artigos"
          aria-current={onBlog ? 'page' : undefined}
        >
          Blog
        </Link>

        {!loading && !user ? (
          <>
            <Link className="btn-nav" to="/cadastro">
              Criar conta
            </Link>
            <Link className="btn-nav" to="/login">
              Entrar
            </Link>
          </>
        ) : null}

        {!loading && user ? (
          <>
            <Link className="btn-nav" to="/conta">
              {user.name}
            </Link>
            {user.role === 'admin' ? (
              <>
                <Link className="btn-nav" to="/admin/artigos">
                  Publicar
                </Link>
                <Link className="btn-nav" to="/admin">
                  Painel
                </Link>
              </>
            ) : null}
          </>
        ) : null}
      </nav>
    </header>
  )
}

export default Header
