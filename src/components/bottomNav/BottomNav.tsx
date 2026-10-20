import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import './style.css'

const NAV_ITEMS = [
  {
    to: '/admin/artigos',
    label: 'Blog',
    isActive: (pathname: string) => pathname.startsWith('/admin/artigos'),
  },
  {
    to: '/admin',
    label: 'Painel',
    isActive: (pathname: string) => pathname === '/admin',
  },
  {
    to: '/conta',
    label: 'Perfil',
    isActive: (pathname: string) => pathname.startsWith('/conta'),
  },
] as const

function BottomNav() {
  const { user, loading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const shouldShow = Boolean(user)
    document.body.classList.toggle('has-bottom-nav', shouldShow)
    return () => {
      document.body.classList.remove('has-bottom-nav')
    }
  }, [user])

  if (loading || !user) return null

  return (
    <nav className="bottom-nav" aria-label="Navegação inferior">
      {NAV_ITEMS.map((item) => {
        const active = item.isActive(location.pathname)

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`bottom-nav-link${active ? ' is-active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default BottomNav
