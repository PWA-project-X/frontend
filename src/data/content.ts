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

export type InsightItem = {
  id: string
  title: string
  summary: string
  tag: string
}

export const companyFallback: CompanyInfo = {
  name: 'Miniverso',
  project: 'Portfólio Interno Miniverso',
  city: 'São Luís, Maranhão',
  description:
    'A Miniverso une tecnologia, design, narrativa e experiências imersivas para marcas e organizações — com foco em conteúdo 3D, realidade virtual e realidade aumentada.',
  proposal:
    'Este portfólio interno organiza em um só lugar a identidade da empresa, suas áreas de atuação, projetos selecionados e o processo de trabalho — de forma simples, responsiva e acessível em qualquer dispositivo.',
}

export const servicesFallback: ServiceItem[] = [
  {
    id: 'conteudo-3d',
    title: 'Conteúdo 3D',
    description:
      'Modelagem, cenários e peças tridimensionais para comunicação visual, produtos digitais e ambientes imersivos.',
  },
  {
    id: 'realidade-virtual',
    title: 'Realidade Virtual',
    description:
      'Experiências em VR para educação, treinamento e ativação de marca, com presença e interação em ambientes virtuais.',
  },
  {
    id: 'realidade-aumentada',
    title: 'Realidade Aumentada',
    description:
      'Camadas digitais sobre o mundo físico para demonstrações, storytelling e engajamento em pontos de contato reais.',
  },
  {
    id: 'experiencias-imersivas',
    title: 'Experiências imersivas',
    description:
      'Jornadas que combinam 3D, RV e RA para criar narrativas memoráveis para marcas e organizações.',
  },
]

export const processStepsFallback: ProcessStepItem[] = [
  {
    id: 'entender',
    number: '01',
    title: 'Entender',
    description:
      'Compreendemos a necessidade, o público e o objetivo do projeto antes de propor a solução.',
  },
  {
    id: 'criar',
    number: '02',
    title: 'Criar',
    description:
      'Desenvolvemos a solução visual, técnica e interativa, com acompanhamento claro em cada etapa.',
  },
  {
    id: 'entregar',
    number: '03',
    title: 'Entregar',
    description:
      'Testamos, apresentamos e disponibilizamos o resultado para o time e o público.',
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

export const insightsFallback: InsightItem[] = [
  {
    id: 'insight-vr',
    title: 'Por que a RV acelera o aprendizado',
    summary:
      'Ambientes virtuais permitem repetir cenários complexos com segurança, aumentando retenção e confiança na prática.',
    tag: 'Realidade Virtual',
  },
  {
    id: 'insight-ar',
    title: 'RA no ponto de contato',
    summary:
      'A realidade aumentada aproxima produto e narrativa do público sem exigir hardware dedicado em todos os contextos.',
    tag: 'Realidade Aumentada',
  },
  {
    id: 'insight-3d',
    title: 'Conteúdo 3D como linguagem',
    summary:
      'Modelos e cenários tridimensionais tornam ideias abstratas concretas — úteis em pitch, treinamento e ativação.',
    tag: 'Conteúdo 3D',
  },
]

export const SECTION_IDS = [
  'home',
  'sobre',
  'servicos',
  'projetos',
  'processo',
  'insights',
  'contato',
] as const

export const NAV_LINKS = [
  { id: 'home', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'processo', label: 'Processo' },
  { id: 'insights', label: 'Insights' },
  { id: 'contato', label: 'Contato' },
] as const
