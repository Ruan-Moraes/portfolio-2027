import { AboutSection } from '@/widgets/about-section';
import { CareerTimeline } from '@/widgets/career-timeline';
import { CertificatesVault } from '@/widgets/certificates-vault';
import { CommandPaletteModal } from '@/widgets/command-palette-modal';
import { ContactMapSection } from '@/widgets/contact-map-section';
import { FooterSection } from '@/widgets/footer-section';
import { HeroShowcase } from '@/widgets/hero-showcase';
import { ProjectsShowcase } from '@/widgets/projects-showcase';
import { ServicesGrid } from '@/widgets/services-grid';
import { SidebarNav } from '@/widgets/sidebar-nav';
import { SkillsSphereSection } from '@/widgets/skills-sphere-section';
import { TopUtilityBar } from '@/widgets/top-utility-bar';
import { StarfieldCanvas } from '@/shared/ui';

export function PortfolioHomeView() {
  return (
    <div className="relative min-h-screen bg-[var(--ui-bg)] text-[var(--ui-text-primary)] selection:bg-[var(--ui-accent)] selection:text-slate-950">
      <StarfieldCanvas />
      <SidebarNav />
      <TopUtilityBar />
      <CommandPaletteModal />

      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 lg:pl-28">
        <HeroShowcase />
        <AboutSection />
        <SkillsSphereSection />
        <CareerTimeline />
        <ProjectsShowcase />
        <CertificatesVault />
        <ServicesGrid />
        <ContactMapSection />
        <FooterSection />
      </main>
    </div>
  );
}
