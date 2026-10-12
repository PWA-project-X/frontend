import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Header from '../components/header/Header'
import './authPages.css'

function LoginPage() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from ||
    (user?.role === 'admin' ? '/admin' : '/conta')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to={from === '/login' ? '/conta' : from} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const next = await login(email, password)
      navigate(next.role === 'admin' && from === '/conta' ? '/admin' : from, {
        replace: true,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app auth-page">
      <Header brand="Miniverso" />
      <main className="auth-main">
        <section className="auth-card" aria-labelledby="login-title">
          <p className="section-number">Acesso</p>
          <h1 id="login-title">Entrar</h1>
          <p className="auth-intro">
            O portfólio é de acesso livre. Entre se já tiver conta, ou crie a
            sua.
          </p>
          <form className="contact-form auth-form" onSubmit={handleSubmit}>
            <label className="contact-field contact-field-full">
              <span>E-mail</span>
              <input
                type="email"
                name="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="contact-field contact-field-full">
              <span>Senha</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error ? (
              <p className="auth-error" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className="contact-submit"
              disabled={submitting}
            >
              {submitting ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
          <p className="auth-foot">
            Não tem conta? <Link to="/cadastro">Criar conta</Link>
            {' · '}
            <Link to="/">Voltar ao portfólio</Link>
          </p>
        </section>
      </main>
    </div>
  )
}

export default LoginPage
