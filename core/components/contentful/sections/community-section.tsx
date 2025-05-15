import { InlineEmailForm } from '@/vibes/soul/primitives/inline-email-form';
import { Facebook, Instagram, Pinterest } from '@/vibes/soul/sections/footer/social-icons';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { subscribe } from '~/components/subscribe/_actions/subscribe';
import { communitySection } from '~/contentful/schema';

export function CommunitySection({
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
        <div className="border-border flex aspect-[2.25] flex-col rounded-lg border bg-white p-8 text-left">
          <h3 className="text-icon-primary mb-2 text-lg font-medium tracking-[1.8px] uppercase lg:text-2xl lg:tracking-[2.4px]">
            {signUpLabel}
          </h3>
          {signUpDescription ? (
            <p className="text-icon-secondary mb-8 max-w-sm">{signUpDescription}</p>
          ) : null}
          <div className="mt-auto">
            <InlineEmailForm action={subscribe} placeholder={signUpPlaceholder} />
          </div>
        </div>
        <div className="border-border flex aspect-[2.25] flex-col rounded-lg border bg-white p-8 text-left">
          <h3 className="text-icon-primary mb-2 text-lg font-medium tracking-[1.8px] uppercase lg:text-2xl lg:tracking-[2.4px]">
            {socialLabel}
          </h3>
          {socialDescription ? (
            <p className="text-icon-secondary mb-8 max-w-sm">{socialDescription}</p>
          ) : null}
          <div className="mt-auto flex flex-1 items-end space-x-4">
            {socialLinks?.map((link) => {
              let Icon;

              if (link.includes('facebook')) Icon = Facebook;
              else if (link.includes('instagram')) Icon = Instagram;
              else if (link.includes('pinterest')) Icon = Pinterest;
              else
                return (
                  <a className="text-icon-primary hover:underline" href={link} key={link}>
                    {link}
                  </a>
                );

              return (
                <a
                  aria-label={`Follow us on ${link}`}
                  className="text-icon-primary border-border inline-flex aspect-square min-w-12 items-center justify-center rounded-full border p-3 hover:opacity-75"
                  href={link}
                  key={link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
