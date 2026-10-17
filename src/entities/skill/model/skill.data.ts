export type SkillCategoryKey =
  | 'languages'
  | 'backend'
  | 'frontend'
  | 'mobile'
  | 'apis'
  | 'databases'
  | 'messaging'
  | 'testing'
  | 'devops'
  | 'architecture';

export interface SkillItem {
  name: string;
  category: SkillCategoryKey;
  highlight?: boolean;
}

export interface CubeFaceTech {
  face: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  subtitle: string;
  color: string;
  symbol: string;
}

export const CUBE_FACES_TECH: CubeFaceTech[] = [
  {
    face: 1,
    name: 'Java & Spring',
    subtitle: 'Spring Boot • Security • JPA',
    color: '#F89820',
    symbol: 'JV',
  },
  {
    face: 2,
    name: 'C# & .NET',
    subtitle: 'ASP.NET Core • EF Core',
    color: '#A855F7',
    symbol: 'C#',
  },
  {
    face: 3,
    name: 'React & Next.js',
    subtitle: 'TypeScript • FSD • Tailwind',
    color: '#06B6D4',
    symbol: 'RX',
  },
  {
    face: 4,
    name: 'React Native',
    subtitle: 'Expo • Ionic • Android & iOS',
    color: '#22C55E',
    symbol: 'RN',
  },
  {
    face: 5,
    name: 'SQL & NoSQL',
    subtitle: 'SQL Server • Postgres • Mongo • Redis',
    color: '#EF4444',
    symbol: 'DB',
  },
  {
    face: 6,
    name: 'Azure & Docker',
    subtitle: 'CI/CD • RabbitMQ • Clean Arch',
    color: '#3B82F6',
    symbol: 'OPS',
  },
];

export const SKILLS_DATA: SkillItem[] = [
  // Linguagens
  { name: 'Java', category: 'languages', highlight: true },
  { name: 'C#', category: 'languages', highlight: true },
  { name: 'TypeScript', category: 'languages', highlight: true },
  { name: 'JavaScript', category: 'languages' },
  { name: 'SQL', category: 'languages', highlight: true },

  // Backend
  { name: 'Spring Boot', category: 'backend', highlight: true },
  { name: 'Spring Data JPA', category: 'backend' },
  { name: 'Spring Security', category: 'backend' },
  { name: 'Spring HATEOAS', category: 'backend' },
  { name: 'ASP.NET Core', category: 'backend', highlight: true },
  { name: 'Entity Framework Core', category: 'backend' },
  { name: 'Node.js', category: 'backend' },

  // Frontend
  { name: 'React', category: 'frontend', highlight: true },
  { name: 'Next.js', category: 'frontend', highlight: true },
  { name: 'AngularJS', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend', highlight: true },
  { name: 'Sass / SCSS', category: 'frontend' },
  { name: 'Bootstrap', category: 'frontend' },
  { name: 'Handlebars', category: 'frontend' },

  // Mobile
  { name: 'React Native', category: 'mobile', highlight: true },
  { name: 'Expo', category: 'mobile', highlight: true },
  { name: 'Ionic', category: 'mobile' },
  { name: 'Android & iOS Store Publish', category: 'mobile' },

  // APIs e Integrações
  { name: 'REST APIs', category: 'apis', highlight: true },
  { name: 'OpenAPI / Swagger', category: 'apis' },
  { name: 'Keycloak', category: 'apis' },
  { name: 'Webhooks', category: 'apis' },
  { name: 'WebSockets', category: 'apis' },
  { name: 'i18n (PT/EN/ES)', category: 'apis', highlight: true },
  { name: 'JWT', category: 'apis' },

  // Bancos de Dados e Cache
  { name: 'SQL Server', category: 'databases', highlight: true },
  { name: 'PostgreSQL', category: 'databases', highlight: true },
  { name: 'MongoDB', category: 'databases', highlight: true },
  { name: 'Redis', category: 'databases', highlight: true },
  { name: 'MySQL', category: 'databases' },
  { name: 'SQLite', category: 'databases' },
  { name: 'H2 Database', category: 'databases' },
  { name: 'Flyway', category: 'databases' },
  { name: 'Mongock', category: 'databases' },

  // Mensageria
  { name: 'RabbitMQ', category: 'messaging', highlight: true },
  { name: 'Apache Kafka', category: 'messaging' },

  // Testes
  { name: 'JUnit 5', category: 'testing', highlight: true },
  { name: 'Mockito', category: 'testing' },
  { name: 'Vitest', category: 'testing', highlight: true },
  { name: 'Testcontainers', category: 'testing', highlight: true },
  { name: 'Testing Library', category: 'testing' },
  { name: 'MSW', category: 'testing' },

  // DevOps & Cloud
  { name: 'Microsoft Azure', category: 'devops', highlight: true },
  { name: 'Azure CI/CD Pipelines', category: 'devops', highlight: true },
  { name: 'Docker', category: 'devops', highlight: true },
  { name: 'Docker Compose', category: 'devops' },
  { name: 'Git & GitHub', category: 'devops' },
  { name: 'Linux', category: 'devops' },

  // Arquitetura, Práticas & IA
  { name: 'Clean Architecture', category: 'architecture', highlight: true },
  { name: 'Feature-Sliced Design (FSD)', category: 'architecture', highlight: true },
  { name: 'Hexagonal Architecture', category: 'architecture', highlight: true },
  { name: 'SOLID & Clean Code', category: 'architecture', highlight: true },
  { name: 'Design Patterns', category: 'architecture' },
  { name: 'MVC', category: 'architecture' },
  { name: 'Big O Notation', category: 'architecture' },
  { name: 'AI-First & MCPs (Claude/Gemini/Ollama)', category: 'architecture' },
];

export const SKILL_CATEGORIES: SkillCategoryKey[] = [
  'languages',
  'backend',
  'frontend',
  'mobile',
  'apis',
  'databases',
  'messaging',
  'testing',
  'devops',
  'architecture',
];
