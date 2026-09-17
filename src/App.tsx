import { useEffect, useState } from 'react'
import {
  getCompany,
  getProcess,
  getProjects,
  getServices,
} from './api/client'
import Header from './components/header/Header'
import HomeSection from './components/homeSection/HomeSection'
import AboutSection from './components/aboutSection/AboutSection'
import ServicesSection from './components/servicesSection/ServicesSection'
import ProjectsSection from './components/projectsSection/ProjectsSection'
import ProcessSection from './components/processSection/ProcessSection'
import SiteFooter from './components/footer/SiteFooter'
import ButtonScrollTop from './components/buttonScrollTop/ButtonScrollTop'
import {
  companyFallback,
  processStepsFallback,
  projectsFallback,
  servicesFallback,
  type CompanyInfo,
  type ProcessStepItem,
  type ProjectItem,
  type ServiceItem,
} from './data/content'
import './App.css'

function App() {
  const [company, setCompany] = useState<CompanyInfo>(companyFallback)
  const [services, setServices] = useState<ServiceItem[]>(servicesFallback)
  const [projects, setProjects] = useState<ProjectItem[]>(projectsFallback)
  const [steps, setSteps] = useState<ProcessStepItem[]>(processStepsFallback)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [companyResult, servicesResult, projectsResult, processResult] =
        await Promise.all([
          getCompany(),
          getServices(),
          getProjects(),
          getProcess(),
        ])
      if (!cancelled) {
        setCompany(companyResult.data)
        setServices(servicesResult.data)
        setProjects(projectsResult.data)
        setSteps(processResult.data)
        setUsingFallback(
          companyResult.fromFallback ||
            servicesResult.fromFallback ||
            projectsResult.fromFallback ||
            processResult.fromFallback,
        )
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="app">
      <Header brand={company.name} />

      {usingFallback ? (
        <p className="api-fallback-notice" role="status">
          Conteúdo local — API indisponível
        </p>
      ) : null}

      <main>
        <HomeSection company={company} />
        <AboutSection company={company} />
        <ServicesSection services={services} />
        <ProjectsSection projects={projects} />
        <ProcessSection steps={steps} />
      </main>

      <SiteFooter brand={company.name} city={company.city} />
      <ButtonScrollTop />
    </div>
  )
}

export default App
