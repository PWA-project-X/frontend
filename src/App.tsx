import ButtonNext from './components/buttonNext/ButtonNext'
import ButtonPrev from './components/buttonPrev/ButtonPrev'
import ButtonScrollTop from './components/buttonScrollTop/ButtonScrollTop'
import './App.css'

const SECTION_IDS = ['inicio', 'sobre', 'servicos', 'processo']

const services = [
  { number: '01', title: 'Consultoria', text: 'Organização de ideias, projetos e soluções para diferentes necessidades.' },
  { number: '02', title: 'Treinamentos', text: 'Conteúdos e capacitações pensados para facilitar o aprendizado.' },
  { number: '03', title: 'Projetos digitais', text: 'Criação de experiências digitais simples, úteis e fáceis de acompanhar.' },
]

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Voltar ao início"><span className="brand-mark">M</span><span>miniverso</span></a>
        <nav className="nav-actions" aria-label="Navegação principal">
          {SECTION_IDS.map((id) => <a key={id} className="nav-link" href={`#${id}`}>{id === 'inicio' ? 'Início' : id[0].toUpperCase() + id.slice(1)}</a>)}
          <ButtonPrev sectionIds={SECTION_IDS} />
          <ButtonNext sectionIds={SECTION_IDS} />
        </nav>
      </header>

      <main>
        <section id="inicio" className="hero section-shell">
          <div className="eyebrow">PORTFÓLIO INTERNO · V.01</div>
          <div className="hero-content">
            <div>
              <h1>Ideias que ganham <em>forma.</em></h1>
              <p className="hero-text">Um espaço simples para organizar projetos, serviços e tudo o que está sendo construído.</p>
              <a className="primary-link" href="#servicos">Ver o que fazemos <span>↓</span></a>
            </div>
            <div className="hero-stamp" aria-hidden="true"><span>+</span><strong>um<br />universo<br />de ideias</strong></div>
          </div>
          <div className="scroll-note">ROLE PARA EXPLORAR <span>↓</span></div>
        </section>

        <section id="sobre" className="section-shell section-light">
          <div className="section-heading"><span className="section-number">01</span><div><p className="eyebrow">SOBRE</p><h2>Um universo para <em>criar.</em></h2></div></div>
          <div className="about-grid"><p className="lead-copy">Este é um esqueleto de apresentação para reunir a identidade, os projetos e as ideias de uma equipe em um só lugar.</p><p>A proposta é manter tudo claro e acessível: uma visão geral do que existe, do que está em andamento e dos próximos passos.</p></div>
        </section>

        <section id="servicos" className="section-shell section-dark">
          <div className="section-heading"><span className="section-number">02</span><div><p className="eyebrow">SERVIÇOS</p><h2>O que <em>fazemos.</em></h2></div></div>
          <div className="service-grid">{services.map((service) => <article className="service-card" key={service.number}><span className="card-number">/{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><span className="card-arrow">↗</span></article>)}</div>
        </section>

        <section id="processo" className="section-shell section-light process-section">
          <div className="section-heading"><span className="section-number">03</span><div><p className="eyebrow">PROCESSO</p><h2>Do começo ao <em>resultado.</em></h2></div></div>
          <div className="process-list">
            <div><span>01</span><strong>Entender</strong><p>Organizar a ideia e definir o objetivo.</p></div>
            <div><span>02</span><strong>Criar</strong><p>Desenvolver uma solução simples e funcional.</p></div>
            <div><span>03</span><strong>Compartilhar</strong><p>Apresentar, testar e melhorar juntos.</p></div>
          </div>
        </section>
      </main>

      <footer className="footer"><span>MINIVERSO · PORTFÓLIO INTERNO</span><span>PROGRAMAÇÃO AVANÇADA PARA WEB · 2026</span></footer>
      <ButtonScrollTop />
    </div>
  )
}

export default App
