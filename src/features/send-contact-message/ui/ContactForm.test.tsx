import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it, vi } from 'vitest';
import messages from '../../../../messages/pt-BR.json';
import { ContactForm } from './ContactForm';

function fillForm() {
  render(
    <NextIntlClientProvider locale="pt-BR" messages={messages}>
      <ContactForm />
    </NextIntlClientProvider>
  );
  fireEvent.change(screen.getByLabelText('Seu Nome'), { target: { value: 'Visitante' } });
  fireEvent.change(screen.getByLabelText('Seu E-mail'), { target: { value: 'visitante@example.com' } });
  fireEvent.change(screen.getByLabelText('Assunto'), { target: { value: 'Contato' } });
  fireEvent.change(screen.getByLabelText('Mensagem'), { target: { value: 'Gostaria de conversar sobre um projeto.' } });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('ContactForm Formspree delivery', () => {
  it('uses the existing public endpoint and clears the form only after acceptance', async () => {
    vi.stubEnv('NEXT_PUBLIC_FORMSPREE_ENDPOINT', '');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar Mensagem' }));
    await screen.findByRole('status');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://formspree.io/f/mojnaybn',
      expect.objectContaining({ method: 'POST', body: expect.stringContaining('visitante@example.com') })
    );
    expect(screen.getByLabelText('Mensagem')).toHaveValue('');
  });

  it('preserves the message and reports delivery failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar Mensagem' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(messages.contact.form.sendError);
    expect(screen.getByLabelText('Mensagem')).toHaveValue('Gostaria de conversar sobre um projeto.');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('reports network failures and allows retrying', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Offline')));
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar Mensagem' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(messages.contact.form.connectionError);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Enviar Mensagem' })).toBeEnabled());
  });
});
