export type CompanyInfo = {
  name: string
  project: string
  city: string
  description: string
  proposal: string
}

export type ServiceItem = {
  id: string
  title: string
  description: string
}

export type ProcessStepItem = {
  id: string
  number: string
  title: string
  description: string
}

export type ProjectItem = {
  id: string
  title: string
  summary: string
  category: string
}

export const companyFallback: CompanyInfo = {
  name: 'Miniverso',
  project: 'Portfólio Interno Miniverso',
  city: 'São Luís, Maranhão',
  description:
    'A Miniverso é uma edtech de São Luís que desenvolve experiências imersivas em realidade virtual para educação, treinamentos corporativos e ativações de marca.',
  proposal:
    'Este portfólio interno organiza em um só lugar as informações sobre a empresa, seus serviços e o processo de trabalho — de forma simples, responsiva e acessível em qualquer dispositivo.',
}

export const servicesFallback: ServiceItem[] = [
  {
    id: 'vr-training',
    title: 'Treinamentos em VR',
    description:
      'Simulações imersivas que aumentam retenção e performance, reduzindo custos de logística e deslocamento.',
  },
  {
    id: 'brand-activation',
    title: 'Ativações de marca',
    description:
      'Experiências interativas em realidade virtual para eventos, campanhas e engajamento de público.',
  },
  {
    id: 'immersive-education',
    title: 'Educação imersiva',
    description:
      'Conteúdos e ambientes virtuais voltados ao aprendizado prático em escolas, universidades e empresas.',
  },
  {
    id: 'xr-consulting',
    title: 'Consultoria em XR',
    description:
      'Apoio técnico e estratégico para projetos de realidade virtual e experiências digitais imersivas.',
  },
]

export const processStepsFallback: ProcessStepItem[] = [
  {
    id: 'entender',
    number: '01',
    title: 'Entender',
    description:
      'Escutamos o contexto, o público e o objetivo. Definimos o que a experiência precisa comunicar e entregar.',
  },
  {
    id: 'criar',
    number: '02',
    title: 'Criar',
    description:
      'Prototipamos e desenvolvemos a solução imersiva, com acompanhamento claro em cada etapa.',
  },
  {
    id: 'compartilhar',
    number: '03',
    title: 'Compartilhar',
    description:
      'Entregamos a experiência, validamos no uso real e compartilhamos o resultado com o time e o público.',
  },
]

export const projectsFallback: ProjectItem[] = [
  {
    id: 'safety-vr',
    title: 'Treinamento de segurança em VR',
    summary:
      'Simulação imersiva de procedimentos de segurança para equipes industriais, com cenários repetíveis e feedback imediato.',
    category: 'Treinamento',
  },
  {
    id: 'campus-tour',
    title: 'Tour virtual acadêmico',
    summary:
      'Ambiente virtual para apresentação de espaços e práticas educacionais, pensado para acolhida e orientação de estudantes.',
    category: 'Educação',
  },
  {
    id: 'brand-experience',
    title: 'Ativação imersiva de marca',
    summary:
      'Experiência em realidade virtual para eventos, conectando o público à narrativa da marca de forma interativa.',
    category: 'Ativação',
  },
  {
    id: 'ops-simulation',
    title: 'Simulação operacional',
    summary:
      'Protótipo de fluxo operacional em VR para treinar decisões rápidas sem interromper a rotina real da equipe.',
    category: 'Corporativo',
  },
]

export const SECTION_IDS = [
  'home',
  'sobre',
  'servicos',
  'projetos',
  'processo',
] as const

export const NAV_LINKS = [
  { id: 'home', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'processo', label: 'Processo' },
] as const
