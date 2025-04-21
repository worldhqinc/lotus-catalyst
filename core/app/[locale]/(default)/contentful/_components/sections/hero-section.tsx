import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { heroSection } from '~/contentful/schema';

export default function HeroSection({ heroTitle, heroTagline }: heroSection['fields']) {
  return (
    <SectionLayout className="bg-surface-image py-20 text-center" containerSize="xl">
      <p className="text-icon-primary tracking-widest uppercase">{heroTitle}</p>
      <h1 className="text-icon-primary font-heading mt-4 text-3xl leading-tight md:text-5xl">
        {heroTagline}
      </h1>
    </SectionLayout>
  );
}
