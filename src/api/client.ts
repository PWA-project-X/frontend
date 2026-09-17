import {
  companyFallback,
  processStepsFallback,
  projectsFallback,
  servicesFallback,
  type CompanyInfo,
  type ProcessStepItem,
  type ProjectItem,
  type ServiceItem,
} from '../data/content'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export type FetchResult<T> = {
  data: T
  fromFallback: boolean
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
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
