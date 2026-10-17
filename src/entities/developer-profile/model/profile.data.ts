export interface SocialLink {
  id: 'github' | 'linkedin' | 'whatsapp' | 'email';
  label: string;
  href: string;
  handle: string;
}

export interface DeveloperProfile {
  fullName: string;
  shortName: string;
  initials: string;
  email: string;
  phoneFormatted: string;
  phoneHref: string;
  whatsappHref: string;
  githubUsername: string;
  githubUrl: string;
  linkedinUrl: string;
  cvPdfPath: string;
  photoPath: string;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates: [number, number];
  };
  socialLinks: SocialLink[];
}

export const DEVELOPER_PROFILE: DeveloperProfile = {
  fullName: 'Ruan Moraes Santos Barbosa',
  shortName: 'Ruan Moraes',
  initials: 'RM',
  email: 'ruanmoraessantosbarbosa@gmail.com',
  phoneFormatted: '(31) 99311-2958',
  phoneHref: 'tel:+5531993112958',
  whatsappHref: 'https://wa.me/5531993112958',
  githubUsername: 'Ruan-Moraes',
  githubUrl: 'https://github.com/Ruan-Moraes',
  linkedinUrl: 'https://www.linkedin.com/in/ruan-dev/',
  cvPdfPath: '/cv/Curriculo_Ruan_Moraes_Dev_Fullstack.pdf',
  photoPath: '/images/ruan-photo.jpg',
  location: {
    city: 'Belo Horizonte',
    state: 'MG',
    country: 'Brasil',
    coordinates: [-19.9191, -43.9386],
  },
  socialLinks: [
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com/Ruan-Moraes',
      handle: '@Ruan-Moraes',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/ruan-dev/',
      handle: 'in/ruan-dev',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: 'https://wa.me/5531993112958',
      handle: '(31) 99311-2958',
    },
    {
      id: 'email',
      label: 'E-mail',
      href: 'mailto:ruanmoraessantosbarbosa@gmail.com',
      handle: 'ruanmoraessantosbarbosa@gmail.com',
    },
  ],
};
