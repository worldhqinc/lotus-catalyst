import { Metadata } from 'next';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Image } from '~/components/image';
import { getHreflangAlternates } from '~/lib/utils';
import BrandArtwork from '~/public/images/Lotus-Pattern.svg';

import { getPageBySlug } from '../[...rest]/page-data';

import { ChatWidgetButton } from './_components/chat-widget-button';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = getHreflangAlternates(['contact'], locale);
  const page = await getPageBySlug('pageStandard', ['contact']);
  const { fields } = page;

  return {
    title: fields.metaTitle || fields.pageName,
    description: fields.metaDescription,
    keywords: fields.metaKeywords,
    alternates,
  };
}

export default function ContactPage() {
  return (
    <>
      <div className="bg-primary relative isolate overflow-hidden py-8 text-center text-white md:py-16">
        <Image
          alt="Lotus Pattern"
          className="absolute inset-0 top-1/2 left-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          src={BrandArtwork}
        />
        <div className="container max-w-[300px] md:max-w-lg lg:max-w-2xl">
          <h1 className="font-heading text-4xl uppercase [word-spacing:0.1em] md:text-6xl">
            Contact Lotus
          </h1>
          <p className="mt-4">Have a question? Need a hand? Our team is ready to help.</p>
        </div>
      </div>
      <div className="container mt-8 lg:mt-16">
        <div className="text-center">
          <p className="text-contrast-400 text-center">
            Our Customer Care team is available Monday through Friday 9:00 am - 4:30 pm ET.
          </p>
          <p className="text-contrast-400 pt-2 text-center">Closed on major US holidays.</p>
        </div>
      </div>
      <div className="container my-8 md:my-16 lg:max-w-[1142px]">
        <div className="border-contrast-200 divide-contrast-200 divide-y rounded-lg border px-4 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))] lg:divide-x lg:divide-y-0 lg:p-8">
          <div className="flex flex-col items-center p-4 text-center lg:p-8">
            <div>
              <h2 className="text-lg font-medium tracking-[1.8px] uppercase md:text-2xl lg:leading-[120%]">
                Chat
              </h2>
              <p className="text-contrast-400 mt-4">Message us directly.</p>
            </div>
            <div className="mt-8">
              <ChatWidgetButton />
            </div>
          </div>
          <div className="flex flex-col items-center p-4 text-center lg:p-8">
            <div>
              <h2 className="text-lg font-medium tracking-[1.8px] uppercase md:text-2xl lg:leading-[120%]">
                Email
              </h2>
              <p className="text-contrast-400 mt-4">Don't have time to chat today?</p>
            </div>
            <div className="mt-8">
              <ButtonLink className="w-full md:w-auto" href="/contact/form" size="medium">
                Send an email
              </ButtonLink>
            </div>
          </div>
          <div className="flex flex-col items-center p-4 text-center lg:p-8">
            <div>
              <h2 className="text-lg font-medium tracking-[1.8px] uppercase md:text-2xl lg:leading-[120%]">
                Call
              </h2>
              <p className="text-contrast-400 mt-4">Talk to us live.</p>
            </div>
            <div className="mt-8">
              <ButtonLink className="w-full md:w-auto" href="tel:18885688761" size="medium">
                1-888-568-8761
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
