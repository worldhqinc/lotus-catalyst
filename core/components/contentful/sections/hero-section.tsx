import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { heroSection } from '~/contentful/schema';

export function HeroSection({ type, heroTitle, heroTagline }: heroSection['fields']) {
  if (type === 'basic') {
    return (
      <SectionLayout className="text-center" containerSize="xl">
        <h1 className="text-surface-foreground font-heading mx-auto max-w-2xl text-center text-4xl uppercase sm:text-6xl">
          {heroTitle}
        </h1>
        <p className="text-contrast-400 mx-auto mt-4 max-w-2xl text-center">{heroTagline}</p>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout className="bg-surface-image py-20 text-center" containerSize="xl">
      <h1 className="text-icon-primary tracking-widest uppercase">{heroTitle}</h1>
      <p className="text-icon-primary font-heading mt-4 text-3xl leading-tight md:text-5xl">
        {heroTagline}
      </p>
    </SectionLayout>
  );
}
