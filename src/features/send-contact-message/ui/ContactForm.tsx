'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DEVELOPER_PROFILE } from '@/entities/developer-profile';
import { Button } from '@/shared/ui';
import { contactMessageSchema } from '../model/contact.schema';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = contactMessageSchema.safeParse({
      name,
      email,
      subject,
      message,
    });

    if (!parsed.success) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(parsed.data),
        });

        if (res.ok) {
          setStatus('success');
          setName('');
          setEmail('');
          setSubject('');
          setMessage('');
          return;
        }
      } catch {
        // Fallback to mailto below if Formspree is unreachable
      }
    }

    // Fallback seguro e imediato via mailto
    const mailtoBody = encodeURIComponent(
      `Nome: ${parsed.data.name}\nE-mail: ${parsed.data.email}\n\n${parsed.data.message}`
    );
    const mailtoSubject = encodeURIComponent(
      `[Portfólio 2027] ${parsed.data.subject}`
    );

    if (typeof window !== 'undefined') {
      window.open(
        `mailto:${DEVELOPER_PROFILE.email}?subject=${mailtoSubject}&body=${mailtoBody}`,
        '_self'
      );
    }

    setStatus('success');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const inputClasses =
    'w-full rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)]/70 px-4 py-3 text-sm text-[var(--ui-text-primary)] placeholder:text-[var(--ui-text-muted)] transition-colors focus:border-[var(--ui-accent)] focus:outline-none';

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-4"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-xs font-medium text-[var(--ui-text-secondary)]"
          >
            {t('name')}
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePlaceholder')}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-xs font-medium text-[var(--ui-text-secondary)]"
          >
            {t('email')}
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className={inputClasses}
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="mb-1.5 block text-xs font-medium text-[var(--ui-text-secondary)]"
        >
          {t('subject')}
        </label>
        <input
          id="contact-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={t('subjectPlaceholder')}
          className={inputClasses}
          required
        />
      </div>

      <div className="flex flex-1 flex-col">
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-xs font-medium text-[var(--ui-text-secondary)]"
        >
          {t('message')}
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('messagePlaceholder')}
          className={`${inputClasses} min-h-[8.5rem] flex-1 resize-none`}
          required
        />
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{t('validationError')}</span>
        </div>
      )}

      {status === 'success' && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{t('success')}</span>
        </div>
      )}

      <div className="pt-1">
        <Button
          type="submit"
          size="lg"
          disabled={status === 'submitting'}
          className="w-full sm:w-auto"
        >
          <Send className="h-4 w-4" />
          <span>{status === 'submitting' ? t('sending') : t('submit')}</span>
        </Button>
      </div>
    </form>
  );
}
