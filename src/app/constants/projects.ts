// src/app/constants/projects.ts
import { Project } from "../models/project.model";

export const PROJECTS: Project[] = [
  {
    id: 'gespro',
    title: 'GesPro - Agenda',
    description: 'Sistema completo de agendamento online para profissionais autônomos e pequenas empresas',
    category: 'Web App',
    tags: [
      'Profissional',
      'Calendário'
    ],
    image: '/images/projects/gespro-agenda.png',
    color: 'bg-betha-pink',
    link: 'https://gespro-agenda.vercel.app'
  },
  {
    id: 'helena',
    title: 'Helena AI',
    description: 'Assistente de IA multifuncional com diversas ferramentas integradas em uma só plataforma',
    category: 'AI Assistant',
    tags: [
      'Inteligência Artificial',
      'Assistente'
    ],
    image: '/images/projects/helena-ai.png',
    color: 'bg-betha-green',
    link: 'https://helena-ai-zeta.vercel.app'
  },
  {
    id: 'bethany',
    title: 'Bethany AI',
    description: 'Assistente de IA especializada para blogueiras e criadoras de conteúdo',
    category: 'Content AI',
    tags: [
      //'Otimização SEO',
      'Reescrita de Textos',
      'Análise de Títulos',
      'Storytelling'
    ],
    image: '/images/projects/bethany-ai.png',
    color: 'bg-betha-yellow',
    link: 'https://bethany-hub.vercel.app'
  },
  /* {
    title: 'Travel App',
    category: 'UI/UX',
    tags: ['Mobile Design', 'UI/UX', 'Figma', 'Prototipagem'],
    image: '/images/projects/project4.jpg',
    color: 'bg-betha-pink',
    link:''
  },
  {
    title: 'Restaurant Website',
    category: 'Web Development',
    tags: ['React', 'Responsivo', 'Cardápio Online', 'Reservas'],
    image: '/images/projects/project5.jpg',
    color: 'bg-betha-green',
    link:''
  },
  {
    title: 'Fitness Tracker',
    category: 'Mobile App',
    tags: ['React Native', 'Health API', 'Gráficos', 'Progresso'],
    image: '/images/projects/project6.jpg',
    color: 'bg-betha-yellow',
    link:''
  } */
];