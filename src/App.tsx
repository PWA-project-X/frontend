import { useEffect, useState } from 'react'
import { getCompany, getServices } from './api/client'
import Header from './components/header/Header'
import HomeSection from './components/homeSection/HomeSection'
import AboutSection from './components/aboutSection/AboutSection'
import ServicesSection from './components/servicesSection/ServicesSection'
import ProcessSection from './components/processSection/ProcessSection'
import ButtonScrollTop from './components/buttonScrollTop/ButtonScrollTop'
import {
  companyFallback,
  servicesFallback,
  type CompanyInfo,
  type ServiceItem,
} from './data/content'
import './App.css'

function App() {
  const [company, setCompany] = useState<CompanyInfo>(companyFallback)
  const [services, setServices] = useState<ServiceItem[]>(servicesFallback)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [companyData, servicesData] = await Promise.all([
        getCompany(),
        getServices(),
      ])
      if (!cancelled) {
        setCompany(companyData)
        setServices(servicesData)
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

      <main>
        <HomeSection company={company} />
        <AboutSection company={company} />
        <ServicesSection services={services} />
        <ProcessSection />
      </main>

      <ButtonScrollTop />
    </div>
  )
}

export default App
