import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { pageHeaderSupport } from '~/contentful/schema';

export function PageHeaderSupport({ title, lead }: pageHeaderSupport['fields']) {
  return (
    <SectionLayout className="bg-primary text-center text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-4xl leading-10 tracking-[-1.2px] uppercase md:text-6xl md:leading-16">
          {title}
        </h1>
        <p className="mt-4 text-lg tracking-[1.8px] uppercase md:text-2xl md:tracking-[2.4px]">
          {lead}
        </p>
      </div>
    </SectionLayout>
  );
}
