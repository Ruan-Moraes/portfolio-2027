import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnimatedLetters, CodeTag, Badge, GlassCard } from '@/shared/ui';

describe('Shared UI Primitives', () => {
  it('renders AnimatedLetters with accessible label and individual characters', () => {
    render(<AnimatedLetters text="Ruan Moraes" delayOffset={2} />);
    expect(screen.getByLabelText('Ruan Moraes')).toBeInTheDocument();
  });

  it('renders decorative CodeTag safely hidden from screen readers', () => {
    const { container } = render(
      <div>
        <CodeTag tag="section" />
        <span>Content Inside</span>
        <CodeTag tag="section" closing />
      </div>,
    );
    expect(screen.getByText('Content Inside')).toBeInTheDocument();
    expect(container.textContent).toContain('<section>');
    expect(container.textContent).toContain('</section>');
  });

  it('renders Badge and GlassCard children', () => {
    render(
      <GlassCard>
        <Badge variant="accent">Next.js 15</Badge>
      </GlassCard>,
    );
    expect(screen.getByText('Next.js 15')).toBeInTheDocument();
  });
});
