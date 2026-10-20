import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  adminCreateProcess,
  adminCreateProject,
  adminCreateService,
  adminCreateUser,
  adminDeleteProcess,
  adminDeleteProject,
  adminDeleteService,
  adminDeleteUser,
  adminGetCompany,
  adminListProcess,
  adminListProjects,
  adminListServices,
  adminListUsers,
  adminUpdateCompany,
  adminUpdateProcess,
  adminUpdateProject,
  adminUpdateService,
  adminUploadImage,
  mediaUrl,
  type AuthUser,
  type UserRole,
} from '../api/client'
import { useAuth } from '../auth/useAuth'
import Header from '../components/header/Header'
import type {
  CompanyInfo,
  ProcessStepItem,
  ProjectItem,
  ServiceItem,
} from '../data/content'
import { confirmRemove } from '../utils/confirmRemove'
import './adminPage.css'
import './authPages.css'
import '../components/contactSection/style.css'

type TabId = 'company' | 'services' | 'projects' | 'process' | 'users'

const TABS: { id: TabId; label: string }[] = [
  { id: 'company', label: 'Empresa' },
  { id: 'services', label: 'Serviços' },
  { id: 'projects', label: 'Projetos' },
  { id: 'process', label: 'Processo' },
  { id: 'users', label: 'Usuários' },
]

function AdminPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<TabId>('company')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [company, setCompany] = useState<CompanyInfo | null>(null)
  const [services, setServices] = useState<ServiceItem[]>([])
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [steps, setSteps] = useState<ProcessStepItem[]>([])
  const [users, setUsers] = useState<AuthUser[]>([])
  const [projectCoverUrl, setProjectCoverUrl] = useState('')
  const [projectEditId, setProjectEditId] = useState('')
  const [uploadingCover, setUploadingCover] = useState(false)

  const featuredCount = projects.filter((item) => item.featured).length

  const flash = useCallback((text: string) => {
    setMessage(text)
    setError(null)
  }, [])

  const fail = useCallback((err: unknown) => {
    setError(err instanceof Error ? err.message : 'Erro inesperado')
    setMessage(null)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      try {
        const [c, s, p, pr, u] = await Promise.all([
          adminGetCompany(),
          adminListServices(),
          adminListProjects(),
          adminListProcess(),
          adminListUsers(),
        ])
        if (cancelled) return
        setCompany(c)
        setServices(s)
        setProjects(p)
        setSteps(pr)
        setUsers(u)
      } catch (err) {
        if (!cancelled) fail(err)
      }
    }

    void loadAll()
    return () => {
      cancelled = true
    }
  }, [fail])

  const saveCompany = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!company) return
    try {
      const next = await adminUpdateCompany(company)
      setCompany(next)
      flash('Empresa atualizada')
    } catch (err) {
      fail(err)
    }
  }

  const saveService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const payload = {
      title: String(data.get('title') || ''),
      description: String(data.get('description') || ''),
    }
    const editId = String(data.get('editId') || '')
    try {
      if (editId) {
        await adminUpdateService(editId, payload)
        flash('Serviço atualizado')
      } else {
        await adminCreateService(payload)
        flash('Serviço criado')
      }
      form.reset()
      setServices(await adminListServices())
    } catch (err) {
      fail(err)
    }
  }

  const resetProjectForm = (form: HTMLFormElement) => {
    form.reset()
    setProjectCoverUrl('')
    setProjectEditId('')
    const featured = form.elements.namedItem('featured')
    if (featured instanceof HTMLInputElement) featured.checked = false
  }

  const uploadProjectCover = async (file: File | undefined) => {
    if (!file) return
    setUploadingCover(true)
    setError(null)
    try {
      const url = await adminUploadImage(file)
      setProjectCoverUrl(url)
      flash('Capa enviada')
    } catch (err) {
      fail(err)
    } finally {
      setUploadingCover(false)
    }
  }

  const saveProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const technologies = String(data.get('technologies') || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    const sortRaw = String(data.get('sortOrder') || '').trim()
    const payload = {
      title: String(data.get('title') || ''),
      summary: String(data.get('summary') || ''),
      category: String(data.get('category') || ''),
      description: String(data.get('description') || ''),
      coverUrl: projectCoverUrl,
      technologies,
      featured: data.get('featured') === 'on',
      sortOrder: sortRaw === '' ? 1 : Number(sortRaw),
    }
    try {
      if (projectEditId) {
        await adminUpdateProject(projectEditId, payload)
        flash('Projeto atualizado')
      } else {
        await adminCreateProject(payload)
        flash('Projeto criado')
      }
      resetProjectForm(form)
      setProjects(await adminListProjects())
    } catch (err) {
      fail(err)
    }
  }

  const saveProcess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const payload = {
      number: String(data.get('number') || ''),
      title: String(data.get('title') || ''),
      description: String(data.get('description') || ''),
    }
    const editId = String(data.get('editId') || '')
    try {
      if (editId) {
        await adminUpdateProcess(editId, payload)
        flash('Etapa atualizada')
      } else {
        await adminCreateProcess(payload)
        flash('Etapa criada')
      }
      form.reset()
      setSteps(await adminListProcess())
    } catch (err) {
      fail(err)
    }
  }

  const saveUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    try {
      await adminCreateUser({
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        password: String(data.get('password') || ''),
        role: (String(data.get('role') || 'user') as UserRole) || 'user',
      })
      flash('Usuário criado')
      form.reset()
      setUsers(await adminListUsers())
    } catch (err) {
      fail(err)
    }
  }

  const fillForm = (formId: string, values: Record<string, string>) => {
    const form = document.getElementById(formId) as HTMLFormElement | null
    if (!form) return
    for (const [key, value] of Object.entries(values)) {
      const field = form.elements.namedItem(key)
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) {
        field.value = value
      }
    }
  }

  return (
    <div className="app admin-page">
      <Header brand="Miniverso" />
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <p className="section-number">Admin</p>
            <h1>Painel</h1>
            <p className="auth-intro">
              Olá, {user?.name}. Edite o conteúdo do portfólio e gerencie
              usuários. Artigos ficam na área dedicada.
            </p>
          </div>
          <div className="admin-articles-actions">
            <Link className="contact-submit auth-link-btn" to="/admin/artigos">
              Gerenciar artigos
            </Link>
            <Link className="btn-nav" to="/">
              Ver site
            </Link>
          </div>
        </div>

        {message ? (
          <p className="admin-flash" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="admin-error" role="alert">
            {error}
          </p>
        ) : null}

        <nav className="admin-tabs" aria-label="Seções do painel">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-tab${tab === item.id ? ' is-active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {tab === 'company' && company ? (
          <form className="contact-form admin-form" onSubmit={saveCompany}>
            <label className="contact-field">
              <span>Nome</span>
              <input
                value={company.name}
                onChange={(e) =>
                  setCompany({ ...company, name: e.target.value })
                }
                required
              />
            </label>
            <label className="contact-field">
              <span>Projeto</span>
              <input
                value={company.project}
                onChange={(e) =>
                  setCompany({ ...company, project: e.target.value })
                }
                required
              />
            </label>
            <label className="contact-field">
              <span>Cidade</span>
              <input
                value={company.city}
                onChange={(e) =>
                  setCompany({ ...company, city: e.target.value })
                }
                required
              />
            </label>
            <label className="contact-field contact-field-full">
              <span>Descrição</span>
              <textarea
                rows={3}
                value={company.description}
                onChange={(e) =>
                  setCompany({ ...company, description: e.target.value })
                }
                required
              />
            </label>
            <label className="contact-field contact-field-full">
              <span>Proposta</span>
              <textarea
                rows={3}
                value={company.proposal}
                onChange={(e) =>
                  setCompany({ ...company, proposal: e.target.value })
                }
                required
              />
            </label>
            <button type="submit" className="contact-submit">
              Salvar empresa
            </button>
          </form>
        ) : null}

        {tab === 'services' ? (
          <div className="admin-panel">
            <form
              id="service-form"
              className="contact-form admin-form"
              onSubmit={saveService}
            >
              <input type="hidden" name="editId" defaultValue="" />
              <label className="contact-field">
                <span>Título</span>
                <input name="title" required />
              </label>
              <label className="contact-field contact-field-full">
                <span>Descrição</span>
                <textarea name="description" rows={3} required />
              </label>
              <button type="submit" className="contact-submit">
                Salvar serviço
              </button>
            </form>
            <ul className="admin-list">
              {services.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <div className="admin-list-actions">
                    <button
                      type="button"
                      className="btn-nav"
                      onClick={() =>
                        fillForm('service-form', {
                          editId: item.id,
                          title: item.title,
                          description: item.description,
                        })
                      }
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn-nav"
                      onClick={async () => {
                        if (!confirmRemove(`o serviço “${item.title}”`)) return
                        try {
                          await adminDeleteService(item.id)
                          setServices(await adminListServices())
                          flash('Serviço removido')
                        } catch (err) {
                          fail(err)
                        }
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === 'projects' ? (
          <div className="admin-panel">
            {featuredCount < 3 || featuredCount > 6 ? (
              <p className="admin-error" role="status">
                A página principal deve exibir entre 3 e 6 projetos em destaque.
                Agora há {featuredCount}.
              </p>
            ) : (
              <p className="admin-flash" role="status">
                {featuredCount} projetos em destaque na página principal.
              </p>
            )}
            <form
              id="project-form"
              className="contact-form admin-form"
              onSubmit={saveProject}
            >
              <input type="hidden" name="editId" value={projectEditId} readOnly />
              <label className="contact-field">
                <span>Título</span>
                <input name="title" required />
              </label>
              <label className="contact-field">
                <span>Categoria</span>
                <input name="category" required />
              </label>
              <label className="contact-field contact-field-full">
                <span>Resumo</span>
                <textarea name="summary" rows={3} required />
              </label>
              <label className="contact-field contact-field-full">
                <span>Descrição completa</span>
                <textarea name="description" rows={5} required />
              </label>
              <label className="contact-field contact-field-full">
                <span>Tecnologias (separadas por vírgula)</span>
                <input
                  name="technologies"
                  placeholder="Unity, VR, C#"
                />
              </label>
              <label className="contact-field">
                <span>Ordem de exibição</span>
                <input name="sortOrder" type="number" min={1} defaultValue={1} />
              </label>
              <label className="contact-field admin-checkbox-field">
                <span>Aparecer em destaque</span>
                <input name="featured" type="checkbox" />
              </label>
              <div className="contact-field contact-field-full admin-cover-field">
                <span>Capa / imagem</span>
                {projectCoverUrl ? (
                  <img
                    className="admin-cover-preview"
                    src={mediaUrl(projectCoverUrl)}
                    alt=""
                  />
                ) : null}
                <div className="admin-cover-actions">
                  <label className="btn-nav admin-file-label">
                    {uploadingCover ? 'Enviando…' : projectCoverUrl ? 'Trocar capa' : 'Enviar capa'}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingCover}
                      onChange={(e) => {
                        void uploadProjectCover(e.target.files?.[0])
                        e.currentTarget.value = ''
                      }}
                    />
                  </label>
                  {projectCoverUrl ? (
                    <button
                      type="button"
                      className="btn-nav"
                      onClick={() => {
                        if (!confirmRemove('a capa')) return
                        setProjectCoverUrl('')
                      }}
                    >
                      Remover capa
                    </button>
                  ) : null}
                </div>
              </div>
              <button type="submit" className="contact-submit">
                Salvar projeto
              </button>
            </form>
            <ul className="admin-list">
              {projects.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>
                      {item.title}{' '}
                      <span className="admin-tag">{item.category}</span>
                      {item.featured ? (
                        <span className="admin-tag">Destaque</span>
                      ) : null}
                      <span className="admin-tag">Ordem {item.sortOrder}</span>
                    </strong>
                    <p>{item.summary}</p>
                  </div>
                  <div className="admin-list-actions">
                    <button
                      type="button"
                      className="btn-nav"
                      onClick={() => {
                        setProjectEditId(item.id)
                        fillForm('project-form', {
                          title: item.title,
                          summary: item.summary,
                          category: item.category,
                          description: item.description,
                          technologies: (item.technologies || []).join(', '),
                          sortOrder: String(item.sortOrder ?? 1),
                        })
                        const form = document.getElementById(
                          'project-form',
                        ) as HTMLFormElement | null
                        const featured = form?.elements.namedItem('featured')
                        if (featured instanceof HTMLInputElement) {
                          featured.checked = Boolean(item.featured)
                        }
                        setProjectCoverUrl(item.coverUrl || '')
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn-nav"
                      onClick={async () => {
                        if (!confirmRemove(`o projeto “${item.title}”`)) return
                        try {
                          await adminDeleteProject(item.id)
                          setProjects(await adminListProjects())
                          flash('Projeto removido')
                        } catch (err) {
                          fail(err)
                        }
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === 'process' ? (
          <div className="admin-panel">
            <form
              id="process-form"
              className="contact-form admin-form"
              onSubmit={saveProcess}
            >
              <input type="hidden" name="editId" defaultValue="" />
              <label className="contact-field">
                <span>Número</span>
                <input name="number" required placeholder="01" />
              </label>
              <label className="contact-field">
                <span>Título</span>
                <input name="title" required />
              </label>
              <label className="contact-field contact-field-full">
                <span>Descrição</span>
                <textarea name="description" rows={3} required />
              </label>
              <button type="submit" className="contact-submit">
                Salvar etapa
              </button>
            </form>
            <ul className="admin-list">
              {steps.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>
                      {item.number} — {item.title}
                    </strong>
                    <p>{item.description}</p>
                  </div>
                  <div className="admin-list-actions">
                    <button
                      type="button"
                      className="btn-nav"
                      onClick={() =>
                        fillForm('process-form', {
                          editId: item.id,
                          number: item.number,
                          title: item.title,
                          description: item.description,
                        })
                      }
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn-nav"
                      onClick={async () => {
                        if (!confirmRemove(`a etapa “${item.title}”`)) return
                        try {
                          await adminDeleteProcess(item.id)
                          setSteps(await adminListProcess())
                          flash('Etapa removida')
                        } catch (err) {
                          fail(err)
                        }
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === 'users' ? (
          <div className="admin-panel">
            <form className="contact-form admin-form" onSubmit={saveUser}>
              <label className="contact-field">
                <span>Nome</span>
                <input name="name" required />
              </label>
              <label className="contact-field">
                <span>E-mail</span>
                <input name="email" type="email" required />
              </label>
              <label className="contact-field">
                <span>Senha</span>
                <input name="password" type="password" required minLength={6} />
              </label>
              <label className="contact-field">
                <span>Papel</span>
                <select name="role" defaultValue="user">
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>
              <button type="submit" className="contact-submit">
                Criar usuário
              </button>
            </form>
            <ul className="admin-list">
              {users.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      {item.email} ·{' '}
                      {item.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </p>
                  </div>
                  <div className="admin-list-actions">
                    <button
                      type="button"
                      className="btn-nav"
                      disabled={item.id === user?.id}
                      onClick={async () => {
                        if (!confirmRemove(`o usuário “${item.name}”`)) return
                        try {
                          await adminDeleteUser(item.id)
                          setUsers(await adminListUsers())
                          flash('Usuário removido')
                        } catch (err) {
                          fail(err)
                        }
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </main>
    </div>
  )
}

export default AdminPage
