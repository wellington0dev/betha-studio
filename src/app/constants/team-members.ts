import { TeamMember } from "../models/team-member.model";

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Wellington A. Reis',
    role: 'Fullstack Developer',
    description: 'Atuo como desenvolvedor principal, responsável pela arquitetura e implementação técnica dos projetos. Cuido da transformação de designs em código funcional, garantindo performance, escalabilidade e manutenibilidade das aplicações.',
    image: '/images/profile/wellington.jpeg',
    color: 'betha-green',
    skills: ['NestJS', 'Ionic', 'Angular']
  },
  {
    name: 'Jullya Oliveira',
    role: 'Frontend Developer',
    description: ' Contribuo como gestora de projetos, organizando tarefas e garantindo entregas de qualidade. Atuo também na criação de interfaces e desenvolvimento de identidade visual, unindo estética, funcionalidade e estratégia para criar experiências claras e atrativas.',
    image: '/images/profile/jullya.jpeg',
    color: 'betha-pink',
    skills: ['Figma', 'Angular', 'UI/UX']
  }
];
