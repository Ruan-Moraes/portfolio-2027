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
  | 'cloud'
  | 'networking'
  | 'engineering'
  | 'reliability'
  | 'architecture'
  | 'complementary'
  | 'studies';

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
    subtitle: 'Spring Boot • JPA • JUnit',
    color: '#F89820',
    symbol: 'JV',
  },
  {
    face: 2,
    name: 'C# & .NET',
    subtitle: 'Web API • EF Core • Migrations',
    color: '#A855F7',
    symbol: 'C#',
  },
  {
    face: 3,
    name: 'Web & Interfaces',
    subtitle: 'React • Next.js • Angular',
    color: '#06B6D4',
    symbol: 'RX',
  },
  {
    face: 4,
    name: 'React Native',
    subtitle: 'Expo • Android • iOS',
    color: '#22C55E',
    symbol: 'RN',
  },
  {
    face: 5,
    name: 'Dados & Performance',
    subtitle: 'SQL Server • PostgreSQL • Redis',
    color: '#EF4444',
    symbol: 'DB',
  },
  {
    face: 6,
    name: 'AWS & Docker',
    subtitle: 'EC2 • ECS • Load Balancing',
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
  { name: 'Hibernate', category: 'backend' },
  { name: 'Spring Security', category: 'backend' },
  { name: 'Spring HATEOAS', category: 'backend' },
  { name: 'ASP.NET Core Web API', category: 'backend', highlight: true },
  { name: 'Entity Framework Core', category: 'backend' },
  { name: 'EF Core Migrations', category: 'backend' },
  { name: 'Node.js', category: 'backend' },

  // Frontend
  { name: 'React', category: 'frontend', highlight: true },
  { name: 'Next.js', category: 'frontend', highlight: true },
  { name: 'Angular', category: 'frontend' },
  { name: 'AngularJS', category: 'frontend' },
  { name: 'HTML5', category: 'frontend' },
  { name: 'CSS3', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend', highlight: true },
  { name: 'Sass / SCSS', category: 'frontend' },
  { name: 'Bootstrap', category: 'frontend' },
  { name: 'Handlebars', category: 'frontend' },
  { name: 'Figma', category: 'frontend' },

  // Mobile
  { name: 'React Native', category: 'mobile', highlight: true },
  { name: 'Expo', category: 'mobile', highlight: true },
  { name: 'Ionic', category: 'mobile' },
  { name: 'Google Play & App Store Publishing', category: 'mobile' },

  // APIs e Integrações
  { name: 'REST APIs', category: 'apis', highlight: true },
  { name: 'OpenAPI / Swagger', category: 'apis' },
  { name: 'Keycloak', category: 'apis' },
  { name: 'Webhooks', category: 'apis' },
  { name: 'WebSockets', category: 'apis' },
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
  { name: 'xUnit', category: 'testing' },
  { name: 'Moq', category: 'testing' },
  { name: 'Playwright', category: 'testing' },

  // DevOps & Cloud
  { name: 'Maven', category: 'devops' },
  { name: 'NuGet', category: 'devops' },
  { name: 'pnpm', category: 'devops' },
  { name: 'CI/CD', category: 'devops', highlight: true },
  { name: 'Docker', category: 'devops', highlight: true },
  { name: 'Docker Compose', category: 'devops' },
  { name: 'Git & GitHub', category: 'devops' },
  { name: 'Linux', category: 'devops' },

  // Cloud
  { name: 'AWS', category: 'cloud', highlight: true },
  { name: 'Amazon EC2', category: 'cloud' },
  { name: 'Amazon VPC', category: 'cloud' },
  { name: 'Subnets', category: 'cloud' },
  { name: 'Security Groups', category: 'cloud' },
  { name: 'Amazon S3 Buckets', category: 'cloud' },
  { name: 'CloudWatch Logs & Metrics', category: 'cloud' },
  { name: 'Elastic Load Balancing', category: 'cloud' },
  { name: 'Amazon Route 53', category: 'cloud' },
  { name: 'AWS IAM', category: 'cloud' },
  { name: 'Amazon CloudFront', category: 'cloud' },
  { name: 'AWS WAF', category: 'cloud' },
  { name: 'Amazon ECS', category: 'cloud' },

  // Redes
  { name: 'OSI Model', category: 'networking' },
  { name: 'TCP/IP', category: 'networking' },
  { name: 'UDP', category: 'networking' },
  { name: 'DNS', category: 'networking' },
  { name: 'HTTP/HTTPS', category: 'networking' },
  { name: 'Routing Tables', category: 'networking' },

  // Engenharia de software
  { name: 'Big O Notation', category: 'engineering' },
  { name: 'Domain-Driven Design (DDD)', category: 'engineering' },
  { name: 'Data Modeling', category: 'engineering' },
  { name: 'Database Indexing', category: 'engineering' },
  { name: 'Event-Driven Architecture', category: 'engineering' },
  { name: 'Asynchronous Processing', category: 'engineering' },
  { name: 'Caching', category: 'engineering' },
  { name: 'Horizontal Scaling', category: 'engineering' },
  { name: 'Load Balancing', category: 'engineering' },

  // Confiabilidade de serviços
  { name: 'Idempotency', category: 'reliability' },
  { name: 'Timeouts', category: 'reliability' },
  { name: 'Retries', category: 'reliability' },
  { name: 'Observability', category: 'reliability' },
  { name: 'Root-Cause Analysis', category: 'reliability' },

  // Arquitetura e práticas
  { name: 'Clean Architecture', category: 'architecture', highlight: true },
  { name: 'Feature-Sliced Design (FSD)', category: 'architecture', highlight: true },
  { name: 'Hexagonal Architecture', category: 'architecture', highlight: true },
  { name: 'SOLID & Clean Code', category: 'architecture', highlight: true },
  { name: 'Design Patterns', category: 'architecture' },
  { name: 'MVC', category: 'architecture' },
  { name: 'i18n (Backend & Frontend)', category: 'architecture', highlight: true },
  { name: 'AI-First & MCPs (Claude/Gemini/Ollama)', category: 'architecture' },

  // Competências complementares e estudos
  { name: 'Python', category: 'complementary' },
  { name: 'FastAPI', category: 'complementary' },
  { name: 'Microsoft Azure', category: 'studies' },
  { name: 'Kotlin', category: 'studies' },
  { name: 'Swift', category: 'studies' },
  { name: 'LangChain', category: 'studies' },
  { name: 'Elasticsearch', category: 'studies' },
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
  'cloud',
  'networking',
  'engineering',
  'reliability',
  'architecture',
  'complementary',
  'studies',
];
