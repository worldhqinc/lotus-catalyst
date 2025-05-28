import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { pageHeaderSupport } from '~/contentful/schema';
import BrandArtwork from '~/public/images/Lotus-Pattern.svg';

export function PageHeaderSupport({ title, lead }: pageHeaderSupport['fields']) {
  return (
    <SectionLayout className="bg-primary relative isolate overflow-hidden text-center text-white">
      <Image
        alt="Lotus Pattern"
        className="absolute inset-0 top-1/2 left-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        src={BrandArtwork}
      />
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
