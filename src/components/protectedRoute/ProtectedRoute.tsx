import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import type { UserRole } from '../../api/client'

type ProtectedRouteProps = {
  children: React.ReactNode
  role?: UserRole
}

function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="auth-loading" role="status">
        Carregando sessão…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (role && user.role !== role) {
    return <Navigate to="/conta" replace />
  }

  return children
}

export default ProtectedRoute
