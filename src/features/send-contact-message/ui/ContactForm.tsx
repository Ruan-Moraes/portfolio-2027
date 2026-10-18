'use client';

import { memo, useState, type FormEvent } from 'react';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DEVELOPER_PROFILE } from '@/entities/developer-profile';
import { Button } from '@/shared/ui';
import { contactMessageSchema } from '../model/contact.schema';

const INPUT_CLASSES =
  'w-full rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface-elevated)]/70 px-4 py-3 text-sm text-[var(--ui-text-primary)] placeholder:text-[var(--ui-text-muted)] transition-colors focus:border-[var(--ui-accent)] focus:outline-none';

function ContactFormComponent() {
  const t = useTranslations('contact.form');

  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    const formData = new FormData(form);

    const parsed = contactMessageSchema.safeParse({
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      subject: String(formData.get('subject') ?? ''),
      message: String(formData.get('message') ?? ''),
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

          form.reset();

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

    form.reset();
  };

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
            name="name"
            type="text"
            defaultValue=""
            placeholder={t('namePlaceholder')}
            className={INPUT_CLASSES}
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
            name="email"
            type="email"
            defaultValue=""
            placeholder={t('emailPlaceholder')}
            className={INPUT_CLASSES}
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
          name="subject"
          type="text"
          defaultValue=""
          placeholder={t('subjectPlaceholder')}
          className={INPUT_CLASSES}
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
          name="message"
          rows={5}
          defaultValue=""
          placeholder={t('messagePlaceholder')}
          className={`${INPUT_CLASSES} min-h-[8.5rem] flex-1 resize-none`}
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

export const ContactForm = memo(ContactFormComponent);

