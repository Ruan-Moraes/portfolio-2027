export type ProjectCategoryFilter =
  | 'all'
  | 'fullstack'
  | 'backend'
  | 'frontend'
  | 'mobile'
  | 'corporate';

export type FeaturedProjectId =
  | 'mangaReader'
  | 'dbmind'
  | 'debugInsight'
  | 'capysCrm'
  | 'studentManagement'
  | 'translateApi';

export interface FeaturedProjectMetadata {
  id: FeaturedProjectId;
  slug: string;
  filterTags: Exclude<ProjectCategoryFilter, 'all'>[];
  technologies: string[];
  githubUrl: string | null;
  secondaryGithubUrl?: string | null;
  liveUrl: string | null;
  isPrivate: boolean;
  accentGradient: string;
}

export interface GitHubRepositoryItem {
  id: number;
  name: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  topics: string[];
  updatedAt: string;
}

export const FEATURED_PROJECTS: FeaturedProjectMetadata[] = [
  {
    id: 'mangaReader',
    slug: 'manga-reader-toonlira',
    filterTags: ['fullstack', 'backend', 'frontend', 'mobile'],
    technologies: [
      'Java',
      'Spring Boot',
      'Spring Security',
      'React',
      'TypeScript',
      'React Native',
      'Expo',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'RabbitMQ',
      'Neo4j',
      'Clean Architecture',
      'Feature-Sliced Design',
      'i18n (PT/EN/ES)',
      'JUnit 5 & Testcontainers',
      'Vitest',
      'Docker Compose',
    ],
    githubUrl: 'https://github.com/Ruan-Moraes/Manga-Reader',
    liveUrl: null,
    isPrivate: false,
    accentGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
  },
  {
    id: 'dbmind',
    slug: 'dbmind-ai-auditor',
    filterTags: ['backend', 'fullstack'],
    technologies: [
      'Java',
      'Spring Boot',
      'PostgreSQL',
      'SQL Server',
      'RabbitMQ',
      'Redis',
      'React',
      'TypeScript',
      'Clean Architecture',
      'Feature-Sliced Design',
      'Execution Plan Analysis',
      'Docker',
    ],
    githubUrl: 'https://github.com/Ruan-Moraes',
    liveUrl: null,
    isPrivate: false,
    accentGradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
  },
  {
    id: 'debugInsight',
    slug: 'debug-insight-devtools',
    filterTags: ['frontend'],
    technologies: [
      'TypeScript',
      'React',
      'Zustand',
      'Chrome DevTools API',
      'Manifest V3',
      'Performance API',
      'Vite Multi-Entry',
      'Vitest',
      'i18n (PT/EN/ES)',
    ],
    githubUrl: 'https://github.com/Ruan-Moraes',
    liveUrl: null,
    isPrivate: false,
    accentGradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
  },
  {
    id: 'capysCrm',
    slug: 'capys-real-estate-ecosystem',
    filterTags: ['corporate', 'fullstack', 'backend', 'mobile'],
    technologies: [
      'C#',
      'ASP.NET Core',
      'Entity Framework Core',
      'SQL Server',
      'React',
      'TypeScript',
      'React Native',
      'Expo',
      'Ionic',
      'AngularJS',
      'SQLite',
      'Redis',
      'Webhooks',
      'Microsoft Azure CI/CD',
    ],
    githubUrl: null,
    liveUrl: null,
    isPrivate: true,
    accentGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
  },
  {
    id: 'studentManagement',
    slug: 'student-management-platform',
    filterTags: ['fullstack', 'backend', 'frontend'],
    technologies: [
      'Java / Spring Boot',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'REST API',
      'SQL',
    ],
    githubUrl: 'https://github.com/Ruan-Moraes/student_management_api',
    secondaryGithubUrl: 'https://github.com/Ruan-Moraes/student-management-ui',
    liveUrl: null,
    isPrivate: false,
    accentGradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
  },
  {
    id: 'translateApi',
    slug: 'translate-api-serverless',
    filterTags: ['backend'],
    technologies: [
      'Python',
      'FastAPI',
      'Argos Translate',
      'OpenAPI / Swagger',
      'Netlify Serverless Functions',
    ],
    githubUrl: 'https://github.com/Ruan-Moraes/Translate-API',
    secondaryGithubUrl: 'https://github.com/Ruan-Moraes/Proxy-translate',
    liveUrl: null,
    isPrivate: false,
    accentGradient: 'from-cyan-500/20 via-emerald-500/10 to-transparent',
  },
];

export const FALLBACK_GITHUB_REPOS: GitHubRepositoryItem[] = [
  {
    id: 101,
    name: 'Manga-Reader',
    description:
      'Plataforma web e mobile para leitura e gerenciamento de mangás (Java, Spring Boot, React, React Native, PostgreSQL, MongoDB, Redis, RabbitMQ).',
    htmlUrl: 'https://github.com/Ruan-Moraes/Manga-Reader',
    homepage: null,
    language: 'TypeScript',
    stargazersCount: 5,
    forksCount: 1,
    topics: ['java', 'spring-boot', 'react', 'react-native', 'fsd', 'clean-architecture'],
    updatedAt: '2026-10-10T15:00:00Z',
  },
  {
    id: 102,
    name: 'Portifolio-2026',
    description:
      'Portfólio pessoal moderno em React 19, TypeScript, Vite e Tailwind CSS com suporte a temas e internacionalização.',
    htmlUrl: 'https://github.com/Ruan-Moraes/Portifolio-2026',
    homepage: 'https://portifolio-2026.vercel.app',
    language: 'TypeScript',
    stargazersCount: 3,
    forksCount: 0,
    topics: ['react', 'typescript', 'tailwindcss', 'i18n'],
    updatedAt: '2026-08-01T12:00:00Z',
  },
  {
    id: 103,
    name: 'student_management_api',
    description: 'Sistema backend de gerenciamento acadêmico de alunos para professores.',
    htmlUrl: 'https://github.com/Ruan-Moraes/student_management_api',
    homepage: null,
    language: 'Java',
    stargazersCount: 2,
    forksCount: 0,
    topics: ['java', 'spring-boot', 'rest-api'],
    updatedAt: '2025-11-15T12:00:00Z',
  },
  {
    id: 104,
    name: 'student-management-ui',
    description:
      'Interface do Sistema de gerenciamento de alunos desenvolvido em React + TypeScript + TailwindCSS.',
    htmlUrl: 'https://github.com/Ruan-Moraes/student-management-ui',
    homepage: null,
    language: 'TypeScript',
    stargazersCount: 2,
    forksCount: 0,
    topics: ['react', 'typescript', 'tailwindcss'],
    updatedAt: '2025-11-15T12:00:00Z',
  },
  {
    id: 105,
    name: 'Translate-API',
    description:
      'API para tradução de textos utilizando Argos-Translate e FastAPI.',
    htmlUrl: 'https://github.com/Ruan-Moraes/Translate-API',
    homepage: null,
    language: 'Python',
    stargazersCount: 2,
    forksCount: 0,
    topics: ['python', 'fastapi', 'translation'],
    updatedAt: '2024-12-10T12:00:00Z',
  },
  {
    id: 106,
    name: 'Portifolio-2024',
    description:
      'Portfólio desenvolvido com HTML, SASS e JavaScript modular consumindo APIs de qualificações e GitHub.',
    htmlUrl: 'https://github.com/Ruan-Moraes/Portifolio-2024',
    homepage: null,
    language: 'SCSS',
    stargazersCount: 2,
    forksCount: 0,
    topics: ['sass', 'javascript', 'portfolio'],
    updatedAt: '2024-09-01T12:00:00Z',
  },
];
