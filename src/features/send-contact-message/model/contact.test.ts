import { describe, expect, it } from 'vitest';
import { contactMessageSchema } from './contact.schema';

describe('send-contact-message feature schema', () => {
  it('validates contact form payload using Zod schema', () => {
    const valid = contactMessageSchema.safeParse({
      name: 'Ruan Moraes',
      email: 'ruan@example.com',
      subject: 'Proposta de Arquitetura Full Stack',
      message: 'Olá Ruan, gostaríamos de conversar sobre um projeto Next.js + Spring Boot.',
    });
    expect(valid.success).toBe(true);

    const invalid = contactMessageSchema.safeParse({
      name: 'R',
      email: 'invalid-email',
      subject: 'Oi',
      message: 'Curto',
    });
    expect(invalid.success).toBe(false);
  });
});
