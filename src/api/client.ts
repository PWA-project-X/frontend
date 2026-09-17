import {
  companyFallback,
  servicesFallback,
  type CompanyInfo,
  type ServiceItem,
} from '../data/content'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export async function getCompany(): Promise<CompanyInfo> {
  try {
    return await fetchJson<CompanyInfo>('/api/company')
  } catch {
    return companyFallback
  }
}

export async function getServices(): Promise<ServiceItem[]> {
  try {
    const data = await fetchJson<{ services: ServiceItem[] }>('/api/services')
    return data.services
  } catch {
    return servicesFallback
  }
}
