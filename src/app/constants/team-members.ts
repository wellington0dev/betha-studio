import { TeamMember } from "../models/team-member.model";

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Seu Nome',
    role: 'Backend Developer',
    description: 'Descrição aqui...',
    image: '/path/to/image.jpg',
    color: 'betha-green',
    skills: ['Node.js', 'TypeScript', 'Python']
  },
  {
    name: 'Outro Nome', 
    role: 'Frontend Developer',
    description: 'Descrição aqui...',
    image: '/path/to/image2.jpg',
    color: 'betha-pink',
    skills: ['React', 'Angular', 'UI/UX']
  }
];