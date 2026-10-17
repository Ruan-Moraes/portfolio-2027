import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useTranslations, type AbstractIntlMessages } from 'next-intl';
import { describe, expect, it } from 'vitest';
import ptBRMessages from '../../../../messages/pt-BR.json';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { PortfolioLocaleProvider } from './locale.context';

function StatefulProbe() {
  const t = useTranslations('common');
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <span data-testid="whatsapp-label">{t('openWhatsApp')}</span>
      <button
        type="button"
        data-testid="increment-btn"
        onClick={() => setCounter((c) => c + 1)}
      >
        Count: {counter}
      </button>
    </div>
  );
}

describe('PortfolioLocaleProvider & LanguageSwitcher (zero-reload locale switch)', () => {
  it('switches locale translations in-place without unmounting or resetting component state', async () => {
    window.history.replaceState(null, '', '/pt-BR');

    render(
      <PortfolioLocaleProvider
        initialLocale="pt-BR"
        initialMessages={ptBRMessages as unknown as AbstractIntlMessages}
      >
        <LanguageSwitcher />
        <StatefulProbe />
      </PortfolioLocaleProvider>
    );

    expect(screen.getByTestId('whatsapp-label')).toHaveTextContent(
      'Chamar no WhatsApp'
    );

    // Mutate local state inside child component
    fireEvent.click(screen.getByTestId('increment-btn'));
    expect(screen.getByTestId('increment-btn')).toHaveTextContent('Count: 1');

    // Switch language to English
    fireEvent.click(screen.getByRole('button', { name: 'EN' }));

    // Translation updated in memory AND local state was preserved (zero remount)
    await waitFor(() => {
      expect(screen.getByTestId('whatsapp-label')).toHaveTextContent(
        'Chat on WhatsApp'
      );
    });
    expect(screen.getByTestId('increment-btn')).toHaveTextContent('Count: 1');
    expect(document.documentElement.lang).toBe('en-US');
    expect(window.location.pathname).toBe('/en-US');

    // Switch language to Spanish
    fireEvent.click(screen.getByRole('button', { name: 'ES' }));
    await waitFor(() => {
      expect(screen.getByTestId('whatsapp-label')).toHaveTextContent(
        'Hablar por WhatsApp'
      );
    });
    expect(screen.getByTestId('increment-btn')).toHaveTextContent('Count: 1');
    expect(document.documentElement.lang).toBe('es-ES');
    expect(window.location.pathname).toBe('/es-ES');
  });
});

