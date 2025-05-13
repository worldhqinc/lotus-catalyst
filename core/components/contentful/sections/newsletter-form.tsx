import { z } from 'zod';

import { InlineEmailForm } from '@/vibes/soul/primitives/inline-email-form';
import CookiePreferencesNotice from '~/components/cookie-preferences-notice';
import { Image } from '~/components/image';
import { subscribe } from '~/components/subscribe/_actions/subscribe';
import { newsletterFormSchema } from '~/contentful/schema';
import BannerBackground from '~/public/images/Lotus-Pattern.svg';

export function NewsletterForm({
  title,
  description,
  inputPlaceholder,
}: z.infer<typeof newsletterFormSchema>['fields']) {
  return (
    <section className="bg-primary text-background relative isolate overflow-hidden py-16 text-center">
      <Image
        alt="Lotus Pattern"
        className="absolute inset-0 top-1/2 left-1/2 -z-10 min-w-[1440px] -translate-x-1/2 -translate-y-1/2"
        height={807}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        src={BannerBackground}
        width={2560}
      />
      <div className="container mx-auto px-4">
        <h2 className="mx-auto mb-4 max-w-xl font-serif text-5xl uppercase">{title}</h2>
        <p className="mx-auto mb-16 max-w-2xl">{description}</p>
        <div className="mx-auto max-w-md">
          <InlineEmailForm
            action={subscribe}
            arrowClassName="text-white"
            inputClassName="h-16 w-full bg-transparent pr-16 text-white placeholder-white placeholder:font-normal focus:outline-none"
            inputContainerClassName="bg-transparent focus-within:border-white"
            placeholder={inputPlaceholder || 'Enter your email'}
          />
          <CookiePreferencesNotice />
        </div>
      </div>
    </section>
  );
}
