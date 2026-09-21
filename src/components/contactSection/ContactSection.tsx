import type { FormEvent } from 'react'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import './style.css'

function ContactSection() {
  const ref = useRevealOnScroll<HTMLElement>()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <section
      ref={ref}
      id="contato"
      className="section section-contato section-reveal"
      aria-labelledby="contato-title"
    >
      <div className="section-inner">
        <p className="section-number">07</p>
        <h2 id="contato-title">Contato</h2>
        <p className="section-intro">
          Formulário visual para a apresentação do portfólio. O envio real fica
          fora do escopo da v1.
        </p>
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <label className="contact-field">
            <span>Nome</span>
            <input type="text" name="name" placeholder="Seu nome" autoComplete="name" />
          </label>
          <label className="contact-field">
            <span>Empresa</span>
            <input
              type="text"
              name="company"
              placeholder="Organização"
              autoComplete="organization"
            />
          </label>
          <label className="contact-field">
            <span>E-mail</span>
            <input
              type="email"
              name="email"
              placeholder="voce@empresa.com"
              autoComplete="email"
            />
          </label>
          <label className="contact-field contact-field-full">
            <span>Descrição do projeto</span>
            <textarea
              name="message"
              rows={4}
              placeholder="Conte em poucas linhas o que você precisa"
            />
          </label>
          <button type="submit" className="contact-submit">
            Enviar (demonstração)
          </button>
          <p className="contact-note" role="note">
            Esta versão não envia dados — apenas demonstra a interface de contato.
          </p>
        </form>
      </div>
    </section>
  )
}

export default ContactSection
