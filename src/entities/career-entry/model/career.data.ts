export type CareerEntryType = 'work' | 'education' | 'milestone';

export interface CareerEntryMetadata {
  id: 'capys' | 'uninter' | 'pcBuild' | 'firstCode' | 'firstContact';
  type: CareerEntryType;
  yearBadge: string;
  isCurrent?: boolean;
  organizationUrl?: string;
  technologies: string[];
}

export const CAREER_ENTRIES: CareerEntryMetadata[] = [
  {
    id: 'capys',
    type: 'work',
    yearBadge: '2025 – Atual',
    isCurrent: true,
    technologies: [
      'C# / .NET',
      'React',
      'TypeScript',
      'React Native',
      'Expo',
      'Ionic',
      'AngularJS',
      'SQL Server',
      'SQLite',
      'Redis',
      'REST APIs',
      'Webhooks',
      'Microsoft Azure CI/CD',
    ],
  },
  {
    id: 'uninter',
    type: 'education',
    yearBadge: '2024 – 2027',
    isCurrent: true,
    technologies: [
      'Engenharia de Software',
      'Clean Architecture',
      'Hexagonal Architecture',
      'SOLID',
      'Design Patterns',
      'Big O Notation',
      'BCNF Database Design',
    ],
  },
  {
    id: 'pcBuild',
    type: 'milestone',
    yearBadge: '2022',
    technologies: [
      'Arquitetura de Computadores',
      'Hardware (Xeon E5 + GTX 1660Ti)',
      'Linux',
      'Windows',
    ],
  },
  {
    id: 'firstCode',
    type: 'milestone',
    yearBadge: '2018',
    technologies: ['Python', 'Algoritmos', 'Lógica de Programação'],
  },
  {
    id: 'firstContact',
    type: 'milestone',
    yearBadge: '2014',
    technologies: ['Sistemas', 'Redes', 'Curiosidade Tecnológica'],
  },
];
