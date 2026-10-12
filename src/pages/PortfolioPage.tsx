import { useEffect, useState } from 'react'
import {
  getCompany,
  getInsights,
  getProcess,
  getProjects,
  getServices,
} from '../api/client'
import Header from '../components/header/Header'
import HomeSection from '../components/homeSection/HomeSection'
import AboutSection from '../components/aboutSection/AboutSection'
import ServicesSection from '../components/servicesSection/ServicesSection'
import ProjectsSection from '../components/projectsSection/ProjectsSection'
import ProcessSection from '../components/processSection/ProcessSection'
import InsightsSection from '../components/insightsSection/InsightsSection'
import ContactSection from '../components/contactSection/ContactSection'
import SiteFooter from '../components/footer/SiteFooter'
import ButtonScrollTop from '../components/buttonScrollTop/ButtonScrollTop'
import {
  companyFallback,
  insightsFallback,
  processStepsFallback,
  projectsFallback,
  servicesFallback,
  type CompanyInfo,
  type InsightItem,
  type ProcessStepItem,
  type ProjectItem,
  type ServiceItem,
} from '../data/content'
import '../App.css'

function PortfolioPage() {
  const [company, setCompany] = useState<CompanyInfo>(companyFallback)
  const [services, setServices] = useState<ServiceItem[]>(servicesFallback)
  const [projects, setProjects] = useState<ProjectItem[]>(projectsFallback)
  const [steps, setSteps] = useState<ProcessStepItem[]>(processStepsFallback)
  const [insights, setInsights] = useState<InsightItem[]>(insightsFallback)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [
        companyResult,
        servicesResult,
        projectsResult,
        processResult,
        insightsResult,
      ] = await Promise.all([
        getCompany(),
        getServices(),
        getProjects(),
        getProcess(),
        getInsights(),
      ])
      if (!cancelled) {
        setCompany(companyResult.data)
        setServices(servicesResult.data)
        setProjects(projectsResult.data)
        setSteps(processResult.data)
        setInsights(insightsResult.data)
        setUsingFallback(
          companyResult.fromFallback ||
            servicesResult.fromFallback ||
            projectsResult.fromFallback ||
            processResult.fromFallback ||
            insightsResult.fromFallback,
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
      <Header brand={company.name} showSectionNav />

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
        <InsightsSection insights={insights} />
        <ContactSection />
      </main>

      <SiteFooter brand={company.name} city={company.city} />
      <ButtonScrollTop />
    </div>
  )
}

export default PortfolioPage
