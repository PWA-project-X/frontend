import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Header from '../components/header/Header'
import './authPages.css'

function RegisterPage() {
  const { user, loading, register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to="/artigos" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register({ name, email, password })
      navigate('/artigos', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no cadastro')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app auth-page">
      <Header brand="Miniverso" />
      <main className="auth-main">
        <section className="auth-card" aria-labelledby="register-title">
          <p className="section-number">Acesso</p>
          <h1 id="register-title">Criar conta</h1>
          <p className="auth-intro">
            Cadastro livre. O portfólio continua aberto sem login; a conta é
            opcional para área pessoal.
          </p>
          <form className="contact-form auth-form" onSubmit={handleSubmit}>
            <label className="contact-field contact-field-full">
              <span>Nome</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
              {submitting ? 'Criando…' : 'Criar conta'}
            </button>
          </form>
          <p className="auth-foot">
            Já tem conta? <Link to="/login">Entrar</Link>
            {' · '}
            <Link to="/">Voltar ao portfólio</Link>
          </p>
        </section>
      </main>
    </div>
  )
}

export default RegisterPage
