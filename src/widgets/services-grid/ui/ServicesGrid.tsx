'use client';

import { Code2, Database, Server, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  SERVICE_OFFERINGS,
  type ServiceOfferingId,
} from '@/entities/service-offering';
import { Badge, GlassCard, SectionHeading } from '@/shared/ui';

const SERVICE_ICONS: Record<ServiceOfferingId, typeof Code2> = {
  fullstack: Code2,
  backend: Server,
  database: Database,
  maintenance: Wrench,
};

export function ServicesGrid() {
  const t = useTranslations('services');

  return (
    <section id="services" className="scroll-mt-20 py-20">
      <SectionHeading
        tag={t('tag')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {SERVICE_OFFERINGS.map((service) => {
          const Icon = SERVICE_ICONS[service.id];
          return (
            <GlassCard
              key={service.id}
              interactive
              className="flex flex-col justify-between p-6 sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--ui-accent)]/12 text-[var(--ui-accent)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-2xl font-black text-[var(--ui-accent)]/35">
                    {service.code}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-[var(--ui-text-primary)]">
                  {t(`items.${service.id}.title`)}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--ui-text-secondary)]">
                  {t(`items.${service.id}.description`)}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5 border-t border-[var(--ui-border)] pt-4">
                {service.tags.map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
