import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import messages from '../../../../messages/pt-BR.json';
import { FALLBACK_CERTIFICATES } from '@/entities/certificate';
import { CertificatesVault } from './CertificatesVault';

describe('certificate pagination', () => {
  it('paginates the catalogue and exposes the individual Estudonauta codes', () => {
    Element.prototype.scrollIntoView = vi.fn();
    render(
      <NextIntlClientProvider locale="pt-BR" messages={messages}>
        <CertificatesVault certificates={FALLBACK_CERTIFICATES} />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole('button', { name: 'Todos (40)' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(12);
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    for (let page = 2; page <= 4; page++) {
      fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    }
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Estudonauta (16)' }));
    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();
    expect(screen.getByText('26D2-B869-5')).toBeInTheDocument();
    expect(screen.getByText('26D2-B8FB-9')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);

    fireEvent.click(screen.getByRole('button', { name: 'Loiane Training (3)' }));
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    expect(screen.queryByRole('navigation', { name: 'Paginação de certificados' })).not.toBeInTheDocument();
  });
});
