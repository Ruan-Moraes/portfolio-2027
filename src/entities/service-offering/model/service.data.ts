export type ServiceOfferingId =
  | 'fullstack'
  | 'backend'
  | 'database'
  | 'maintenance';

export interface ServiceOfferingMetadata {
  id: ServiceOfferingId;
  code: string;
  tags: string[];
}

export const SERVICE_OFFERINGS: ServiceOfferingMetadata[] = [
  {
    id: 'fullstack',
    code: '01',
    tags: ['React', 'Next.js', 'TypeScript', 'React Native', 'Expo', 'Android & iOS'],
  },
  {
    id: 'backend',
    code: '02',
    tags: ['Java', 'Spring Boot', 'C# / .NET', 'REST', 'Webhooks', 'RabbitMQ', 'Keycloak'],
  },
  {
    id: 'database',
    code: '03',
    tags: ['SQL Server Tuning', 'PostgreSQL', 'MongoDB', 'Redis', 'Execution Plans', 'Flyway'],
  },
  {
    id: 'maintenance',
    code: '04',
    tags: ['Clean Architecture', 'FSD', 'Azure CI/CD', 'Docker', 'JUnit & Testcontainers', 'Vitest'],
  },
];
