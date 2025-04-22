import { SiFacebook, SiInstagram, SiPinterest } from '@icons-pack/react-simple-icons';
import { ArrowRight } from 'lucide-react';

import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { communitySection } from '~/contentful/schema';

export default function CommunitySection({
  sectionTitle,
  sectionDescription,
  signUpLabel,
  signUpDescription,
  signUpPlaceholder,
  socialLabel,
  socialDescription,
  socialLinks,
}: communitySection['fields']) {
  return (
    <SectionLayout className="text-center" containerClassName="py-16" containerSize="xl">
      <h2 className="text-icon-primary mb-4 text-4xl">{sectionTitle}</h2>
      {sectionDescription ? (
        <p className="text-icon-secondary mx-auto mb-8 max-w-3xl text-center">
          {sectionDescription}
        </p>
      ) : null}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="border-border flex flex-col rounded-lg border bg-white p-8 text-left">
          <h3 className="text-icon-primary mb-2 text-2xl font-medium tracking-widest uppercase">
            {signUpLabel}
          </h3>
          {signUpDescription ? (
            <p className="text-icon-secondary mb-8 max-w-sm">{signUpDescription}</p>
          ) : null}
          <form className="flex flex-1 flex-col justify-end pt-10">
            <label className="sr-only" htmlFor="email">
              {signUpLabel}
            </label>
            <div className="relative">
              <input
                className="border-contrast-200 text-icon-secondary font-heading w-full border-b p-3 pr-10"
                id="email"
                placeholder={signUpPlaceholder}
                type="email"
              />
              <button
                className="border-border absolute inset-y-0 top-1/2 right-0 flex h-min -translate-y-1/2 items-center rounded-full border bg-white p-2 disabled:opacity-50"
                type="submit"
              >
                <ArrowRight className="text-icon-primary h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
        <div className="border-border flex flex-col rounded-lg border bg-white p-8 text-left">
          <h3 className="text-icon-primary mb-2 text-2xl font-medium tracking-widest uppercase">
            {socialLabel}
          </h3>
          {socialDescription ? (
            <p className="text-icon-secondary mb-8 max-w-sm">{socialDescription}</p>
          ) : null}
          <div className="flex flex-1 items-end space-x-4 pt-10">
            {socialLinks?.map((link) => {
              let Icon;

              if (link.includes('facebook')) Icon = SiFacebook;
              else if (link.includes('instagram')) Icon = SiInstagram;
              else if (link.includes('pinterest')) Icon = SiPinterest;
              else
                return (
                  <a className="text-icon-primary hover:underline" href={link} key={link}>
                    {link}
                  </a>
                );

              return (
                <a
                  className="text-icon-primary border-border rounded-full border p-3 hover:opacity-75"
                  href={link}
                  key={link}
                >
                  <Icon className="h-6 w-6" title={Icon.name} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
