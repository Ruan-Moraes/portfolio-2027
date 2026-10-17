import type { SupportedLocale } from '@/shared/config';

export type CertificatePlatform = 'Udemy' | 'DIO';

export interface CertificateItem {
  id: string;
  titles: Record<SupportedLocale, string>;
  endDate: string;
  platform: CertificatePlatform;
  credentialUrl: string;
  skills: string[];
}

export const CERTIFICATES_DATA: CertificateItem[] = [
  {
    id: 'cert-react-2024',
    titles: {
      'pt-BR': 'Curso de React',
      'en-US': 'React Complete Course',
      'es-ES': 'Curso Completo de React',
    },
    endDate: '12/2024',
    platform: 'Udemy',
    credentialUrl:
      'https://www.udemy.com/certificate/UC-52e4c926-3fa3-41b0-bd40-267523b31a61/',
    skills: ['React', 'Hooks', 'Component Architecture', 'SPA'],
  },
  {
    id: 'cert-typescript-2024',
    titles: {
      'pt-BR': 'Curso de TypeScript',
      'en-US': 'TypeScript Mastering Course',
      'es-ES': 'Curso de TypeScript',
    },
    endDate: '11/2024',
    platform: 'Udemy',
    credentialUrl:
      'https://www.udemy.com/certificate/UC-80e7054f-03c5-4908-84f1-03ba9c8b972b/',
    skills: ['TypeScript', 'Generics', 'Strict Typing', 'Design Patterns'],
  },
  {
    id: 'cert-frontend-2024',
    titles: {
      'pt-BR': 'Curso de Front-end Completo',
      'en-US': 'Complete Front-End Engineering',
      'es-ES': 'Ingeniería Front-End Completa',
    },
    endDate: '11/2024',
    platform: 'Udemy',
    credentialUrl:
      'https://www.udemy.com/certificate/UC-4073eb31-f168-4baa-bf68-5634bcbc1967/',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI'],
  },
  {
    id: 'cert-java-2024',
    titles: {
      'pt-BR': 'Curso de Java & Orientação a Objetos',
      'en-US': 'Java & Object-Oriented Programming',
      'es-ES': 'Java y Programación Orientada a Objetos',
    },
    endDate: '10/2024',
    platform: 'Udemy',
    credentialUrl:
      'https://www.udemy.com/certificate/UC-1d91eecb-f97a-4b6e-ad2e-2cb0b5b91df5/',
    skills: ['Java', 'OOP', 'Collections', 'SOLID'],
  },
  {
    id: 'cert-figma-2024',
    titles: {
      'pt-BR': 'Curso de Figma & Design de Interfaces',
      'en-US': 'Figma & UI/UX Interface Design',
      'es-ES': 'Figma y Diseño de Interfaces UI/UX',
    },
    endDate: '10/2024',
    platform: 'Udemy',
    credentialUrl:
      'https://www.udemy.com/certificate/UC-1d91eecb-f97a-4b6e-ad2e-2cb0b5b91df5/',
    skills: ['Figma', 'Design Systems', 'Prototyping', 'UI/UX'],
  },
  {
    id: 'cert-nodejs-2024',
    titles: {
      'pt-BR': 'Curso de Node.js & APIs REST',
      'en-US': 'Node.js & RESTful APIs',
      'es-ES': 'Node.js y APIs RESTful',
    },
    endDate: '09/2024',
    platform: 'Udemy',
    credentialUrl:
      'https://www.udemy.com/certificate/UC-34d3b6f4-7952-40a2-8735-b9dc3b324c1c/',
    skills: ['Node.js', 'Express', 'REST APIs', 'SQL/NoSQL'],
  },
  {
    id: 'cert-santander-java-2024',
    titles: {
      'pt-BR': 'Santander Bootcamp | Java Back-End',
      'en-US': 'Santander Bootcamp | Java Back-End',
      'es-ES': 'Santander Bootcamp | Java Back-End',
    },
    endDate: '07/2024',
    platform: 'DIO',
    credentialUrl: 'https://hermes.dio.me/certificates/PHJEFGEN.pdf',
    skills: ['Java', 'Spring Boot', 'Spring Data JPA', 'Spring Security'],
  },
  {
    id: 'cert-javascript-2024',
    titles: {
      'pt-BR': 'Curso de JavaScript Moderno (ES6+)',
      'en-US': 'Modern JavaScript (ES6+)',
      'es-ES': 'JavaScript Moderno (ES6+)',
    },
    endDate: '04/2024',
    platform: 'Udemy',
    credentialUrl:
      'https://www.udemy.com/certificate/UC-fca34380-7b03-406d-9800-1b151335832c/',
    skills: ['JavaScript', 'Async/Await', 'DOM', 'ES Modules'],
  },
  {
    id: 'cert-santander-js-2024',
    titles: {
      'pt-BR': 'Santander Bootcamp | JavaScript',
      'en-US': 'Santander Bootcamp | JavaScript',
      'es-ES': 'Santander Bootcamp | JavaScript',
    },
    endDate: '02/2024',
    platform: 'DIO',
    credentialUrl: 'https://hermes.dio.me/certificates/K0Y9UYH4.pdf',
    skills: ['JavaScript', 'Web Development', 'Algorithms'],
  },
  {
    id: 'cert-git-github-2024',
    titles: {
      'pt-BR': 'Curso de Git e GitHub',
      'en-US': 'Git & GitHub Version Control',
      'es-ES': 'Control de Versiones con Git y GitHub',
    },
    endDate: '02/2024',
    platform: 'Udemy',
    credentialUrl:
      'https://www.udemy.com/certificate/UC-b9eb5669-b222-47f5-ab88-39ddef43a78e/',
    skills: ['Git', 'GitHub', 'Git Flow', 'Pull Requests'],
  },
  {
    id: 'cert-sass-2023',
    titles: {
      'pt-BR': 'Curso de SASS e SCSS',
      'en-US': 'SASS & SCSS Architecture',
      'es-ES': 'Arquitectura CSS con SASS y SCSS',
    },
    endDate: '09/2023',
    platform: 'Udemy',
    credentialUrl:
      'https://www.udemy.com/certificate/UC-df57fceb-4d6f-490c-9ea5-ca017ebdf803/',
    skills: ['Sass', 'SCSS', 'Mixins', 'Modular CSS'],
  },
  {
    id: 'cert-bootstrap-2023',
    titles: {
      'pt-BR': 'Curso de Bootstrap 5',
      'en-US': 'Bootstrap 5 Responsive Design',
      'es-ES': 'Diseño Responsivo con Bootstrap 5',
    },
    endDate: '08/2023',
    platform: 'Udemy',
    credentialUrl:
      'https://www.udemy.com/certificate/UC-09be9a09-ebf3-40ea-8db8-eb1d3ade5da6/',
    skills: ['Bootstrap', 'Grid System', 'Responsive UI'],
  },
  {
    id: 'cert-tailwind-2023',
    titles: {
      'pt-BR': 'Curso de Tailwind CSS',
      'en-US': 'Tailwind CSS Utility-First Styling',
      'es-ES': 'Diseño Moderno con Tailwind CSS',
    },
    endDate: '08/2023',
    platform: 'Udemy',
    credentialUrl:
      'https://www.udemy.com/certificate/UC-f9e7392e-ff4c-4c9b-9ce1-f336e79a/',
    skills: ['Tailwind CSS', 'Design Tokens', 'Dark Mode'],
  },
];
