import ButtonHome from './components/buttonHome/ButtonHome'
import ButtonNext from './components/buttonNext/ButtonNext'
import ButtonPrev from './components/buttonPrev/ButtonPrev'
import ButtonScrollTop from './components/buttonScrollTop/ButtonScrollTop'
import './App.css'

const SECTION_IDS = ['home', 'recursos', 'sobre']

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <strong className="brand">PWA Project X</strong>
        <nav className="nav-actions" aria-label="Atalhos de navegação">
          <ButtonHome targetId="home" />
          <ButtonPrev sectionIds={SECTION_IDS} />
          <ButtonNext sectionIds={SECTION_IDS} />
        </nav>
      </header>

      <main>
        <section id="home" className="section section-home">
          <h1>Aplicação web dinâmica + PWA</h1>
          <p>
            Scaffold inicial da disciplina: layout responsivo, componentes
            organizados e suporte a funcionamento offline via Vite PWA.
          </p>
        </section>

        <section id="recursos" className="section section-recursos">
          <h2>Recursos principais</h2>
          <ul>
            <li>React + TypeScript + Vite</li>
            <li>PWA com service worker e cache offline</li>
            <li>Componentes com CSS separado por pasta</li>
            <li>Atalhos para home, seção anterior e próxima</li>
          </ul>
        </section>

        <section id="sobre" className="section section-sobre">
          <h2>Próximos passos</h2>
          <p>
            Esta base será adaptada ao briefing do cliente. Por enquanto, o
            foco é estrutura, navegação e instalação como PWA.
          </p>
          <p className="hint">
            Para testar PWA de verdade: <code>npm run build</code> e depois{' '}
            <code>npm run preview</code>.
          </p>
        </section>
      </main>

      <ButtonScrollTop />
    </div>
  )
}

export default App
