import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { NAV_LINKS, SECTION_IDS } from '../../data/content'
import './style.css'

type HeaderProps = {
  brand: string
  showSectionNav?: boolean
}

function Header({ brand, showSectionNav = false }: HeaderProps) {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeId, setActiveId] = useState<string>(SECTION_IDS[0])
  const onPortfolio = location.pathname === '/'
  const onBlog = location.pathname.startsWith('/artigos')

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

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="topbar">
      <div className="topbar-main">
        <Link to="/" className="brand">
          {brand}
        </Link>

        {showSectionNav && onPortfolio ? (
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
        ) : null}
      </div>

      <Link
        to="/artigos"
        className={`topbar-blog${onBlog ? ' is-active' : ''}`}
        aria-current={onBlog ? 'page' : undefined}
      >
        Blog
      </Link>

      <nav className="nav-actions" aria-label="Conta e atalhos">
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
            <button type="button" className="btn-nav" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : null}
      </nav>
    </header>
  )
}

export default Header
