import {
  companyFallback,
  insightsFallback,
  processStepsFallback,
  projectsFallback,
  servicesFallback,
  type ArticleItem,
  type CompanyInfo,
  type InsightItem,
  type ProcessStepItem,
  type ProjectItem,
  type ServiceItem,
} from '../data/content'

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:3001')

export function mediaUrl(path: string | undefined | null): string {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export type FetchResult<T> = {
  data: T
  fromFallback: boolean
}

export type UserRole = 'user' | 'admin'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const isFormData =
    typeof FormData !== 'undefined' && init?.body instanceof FormData
  return fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await apiFetch(path, init)
  if (!response.ok) {
    let message = `Request failed: ${response.status}`
    try {
      const body = (await response.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // ignore parse errors
    }
    throw new Error(message)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return response.json() as Promise<T>
}

export async function getCompany(): Promise<FetchResult<CompanyInfo>> {
  try {
    const data = await fetchJson<CompanyInfo>('/api/company')
    return { data, fromFallback: false }
  } catch {
    return { data: companyFallback, fromFallback: true }
  }
}

export async function getServices(): Promise<FetchResult<ServiceItem[]>> {
  try {
    const payload = await fetchJson<{ services: ServiceItem[] }>('/api/services')
    return { data: payload.services, fromFallback: false }
  } catch {
    return { data: servicesFallback, fromFallback: true }
  }
}

export async function getProcess(): Promise<FetchResult<ProcessStepItem[]>> {
  try {
    const payload = await fetchJson<{ steps: ProcessStepItem[] }>('/api/process')
    return { data: payload.steps, fromFallback: false }
  } catch {
    return { data: processStepsFallback, fromFallback: true }
  }
}

export async function getProjects(): Promise<FetchResult<ProjectItem[]>> {
  try {
    const payload = await fetchJson<{ projects: ProjectItem[] }>('/api/projects')
    return { data: payload.projects, fromFallback: false }
  } catch {
    return { data: projectsFallback, fromFallback: true }
  }
}

export async function getProject(id: string): Promise<ProjectItem> {
  return fetchJson<ProjectItem>(`/api/projects/${id}`)
}

export async function getInsights(): Promise<FetchResult<InsightItem[]>> {
  try {
    const payload = await fetchJson<{ insights: InsightItem[] }>('/api/insights')
    return { data: payload.insights, fromFallback: false }
  } catch {
    return { data: insightsFallback, fromFallback: true }
  }
}

export async function getArticles(): Promise<ArticleItem[]> {
  const payload = await fetchJson<{ articles: ArticleItem[] }>('/api/articles')
  return payload.articles
}

export async function getArticle(id: string): Promise<ArticleItem> {
  return fetchJson<ArticleItem>(`/api/articles/${id}`)
}

export async function login(
  email: string,
  password: string,
): Promise<AuthUser> {
  const payload = await fetchJson<{ user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return payload.user
}

export async function register(data: {
  name: string
  email: string
  password: string
}): Promise<AuthUser> {
  const payload = await fetchJson<{ user: AuthUser }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return payload.user
}

export async function logout(): Promise<void> {
  await fetchJson<{ ok: boolean }>('/api/auth/logout', { method: 'POST' })
}

export async function getMe(): Promise<AuthUser | null> {
  try {
    const payload = await fetchJson<{ user: AuthUser }>('/api/auth/me')
    return payload.user
  } catch {
    return null
  }
}

export async function adminGetCompany(): Promise<CompanyInfo> {
  return fetchJson<CompanyInfo>('/api/admin/company')
}

export async function adminUpdateCompany(
  data: CompanyInfo,
): Promise<CompanyInfo> {
  return fetchJson<CompanyInfo>('/api/admin/company', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function adminListServices(): Promise<ServiceItem[]> {
  const payload = await fetchJson<{ services: ServiceItem[] }>(
    '/api/admin/services',
  )
  return payload.services
}

export async function adminCreateService(
  data: Omit<ServiceItem, 'id'> & { id?: string },
): Promise<ServiceItem> {
  return fetchJson<ServiceItem>('/api/admin/services', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function adminUpdateService(
  id: string,
  data: Omit<ServiceItem, 'id'>,
): Promise<ServiceItem> {
  return fetchJson<ServiceItem>(`/api/admin/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function adminDeleteService(id: string): Promise<void> {
  await fetchJson<{ ok: boolean }>(`/api/admin/services/${id}`, {
    method: 'DELETE',
  })
}

export async function adminListProjects(): Promise<ProjectItem[]> {
  const payload = await fetchJson<{ projects: ProjectItem[] }>(
    '/api/admin/projects',
  )
  return payload.projects
}

export async function adminCreateProject(
  data: Omit<ProjectItem, 'id'> & { id?: string },
): Promise<ProjectItem> {
  return fetchJson<ProjectItem>('/api/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function adminUpdateProject(
  id: string,
  data: Omit<ProjectItem, 'id'>,
): Promise<ProjectItem> {
  return fetchJson<ProjectItem>(`/api/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function adminDeleteProject(id: string): Promise<void> {
  await fetchJson<{ ok: boolean }>(`/api/admin/projects/${id}`, {
    method: 'DELETE',
  })
}

export async function adminListProcess(): Promise<ProcessStepItem[]> {
  const payload = await fetchJson<{ steps: ProcessStepItem[] }>(
    '/api/admin/process',
  )
  return payload.steps
}

export async function adminCreateProcess(
  data: Omit<ProcessStepItem, 'id'> & { id?: string },
): Promise<ProcessStepItem> {
  return fetchJson<ProcessStepItem>('/api/admin/process', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function adminUpdateProcess(
  id: string,
  data: Omit<ProcessStepItem, 'id'>,
): Promise<ProcessStepItem> {
  return fetchJson<ProcessStepItem>(`/api/admin/process/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function adminDeleteProcess(id: string): Promise<void> {
  await fetchJson<{ ok: boolean }>(`/api/admin/process/${id}`, {
    method: 'DELETE',
  })
}

export async function adminListInsights(): Promise<ArticleItem[]> {
  const payload = await fetchJson<{ insights: ArticleItem[] }>(
    '/api/admin/insights',
  )
  return payload.insights
}

export async function adminCreateInsight(
  data: Omit<ArticleItem, 'id' | 'createdAt'> & { id?: string },
): Promise<ArticleItem> {
  return fetchJson<ArticleItem>('/api/admin/insights', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function adminUpdateInsight(
  id: string,
  data: Omit<ArticleItem, 'id' | 'createdAt'>,
): Promise<ArticleItem> {
  return fetchJson<ArticleItem>(`/api/admin/insights/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function adminUpdateInsightPlacement(
  id: string,
  data: { showOnHome?: boolean; archived?: boolean },
): Promise<ArticleItem> {
  return fetchJson<ArticleItem>(`/api/admin/insights/${id}/placement`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function adminReorderHomeInsights(
  ids: string[],
): Promise<ArticleItem[]> {
  const payload = await fetchJson<{ insights: ArticleItem[] }>(
    '/api/admin/insights/home-order',
    {
      method: 'PUT',
      body: JSON.stringify({ ids }),
    },
  )
  return payload.insights
}

export async function adminDeleteInsight(id: string): Promise<void> {
  await fetchJson<{ ok: boolean }>(`/api/admin/insights/${id}`, {
    method: 'DELETE',
  })
}

export async function adminUploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const payload = await fetchJson<{ url: string }>('/api/admin/uploads', {
    method: 'POST',
    body: form,
  })
  return payload.url
}

export async function adminListUsers(): Promise<AuthUser[]> {
  const payload = await fetchJson<{ users: AuthUser[] }>('/api/admin/users')
  return payload.users
}

export async function adminCreateUser(data: {
  name: string
  email: string
  password: string
  role: UserRole
}): Promise<AuthUser> {
  const payload = await fetchJson<{ user: AuthUser }>('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return payload.user
}

export async function adminDeleteUser(id: string): Promise<void> {
  await fetchJson<{ ok: boolean }>(`/api/admin/users/${id}`, {
    method: 'DELETE',
  })
}
