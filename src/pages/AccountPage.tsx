import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import Header from '../components/header/Header'
import './authPages.css'

function AccountPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="app auth-page">
      <Header brand="Miniverso" />
      <main className="auth-main">
        <section className="auth-card" aria-labelledby="account-title">
          <p className="section-number">Conta</p>
          <h1 id="account-title">Olá, {user.name}</h1>
          <p className="auth-intro">
            O portfólio e o blog são abertos para todos. A conta guarda os seus
            dados de acesso e, para administradores, o painel de publicação.
          </p>
          <dl className="account-meta">
            <div>
              <dt>Nome</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Papel</dt>
              <dd>{user.role === 'admin' ? 'Administrador' : 'Usuário'}</dd>
            </div>
          </dl>
          <div className="auth-actions">
            <Link className="contact-submit auth-link-btn" to="/artigos">
              Ver artigos
            </Link>
            <Link className="btn-nav" to="/">
              Portfólio
            </Link>
            {user.role === 'admin' ? (
              <Link className="btn-nav" to="/admin">
                Abrir painel
              </Link>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  )
}

export default AccountPage
