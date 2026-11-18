import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import messages from '../../../../messages/pt-BR.json';
import { CERTIFICATES_DATA } from '@/entities/certificate';
import { CertificatesVault } from './CertificatesVault';

describe('certificate pagination', () => {
  it('limits pages to 12, navigates without duplicates, and resets when filtering', () => {
    Element.prototype.scrollIntoView = vi.fn();
    render(<NextIntlClientProvider locale="pt-BR" messages={messages}><CertificatesVault /></NextIntlClientProvider>);
    const firstPage = screen.getAllByRole('heading', { level: 3 }).map(node => node.textContent);
    expect(firstPage).toHaveLength(12);
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    const secondPage = screen.getAllByRole('heading', { level: 3 }).map(node => node.textContent);
    expect(secondPage).toHaveLength(Math.min(12, CERTIFICATES_DATA.length - 12));
    expect(secondPage.some(title => firstPage.includes(title))).toBe(false);
    expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(screen.getAllByRole('heading', { level: 3 }).map(node => node.textContent)).toEqual(firstPage);
    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    fireEvent.click(screen.getByRole('button', { name: /^DIO/ }));
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(CERTIFICATES_DATA.filter(cert => cert.platform === 'DIO').length);
    expect(screen.queryByRole('navigation', { name: 'Paginação de certificados' })).not.toBeInTheDocument();
  });
});
