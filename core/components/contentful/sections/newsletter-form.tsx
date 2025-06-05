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
    <section className="bg-primary text-background @container relative isolate overflow-hidden py-16 text-center">
      <Image
        alt="Lotus Pattern"
        className="absolute inset-0 top-1/2 left-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
        height={807}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        src={BannerBackground}
        width={2560}
      />
      <div className="container mx-auto text-white">
        <h2 className="font-heading mx-auto mb-4 max-w-xl text-5xl uppercase">{title}</h2>
        <p className="mx-auto mb-8 max-w-2xl lg:mb-16">{description}</p>
        <div className="[&_button:hover_svg]:!text-foreground mx-auto max-w-md space-y-4 [&_div:not(.form-status)]:text-white">
          <InlineEmailForm
            action={subscribe}
            arrowClassName="text-white"
            inputClassName="h-16 w-full bg-transparent pr-16 !text-white placeholder-white placeholder:font-normal focus:outline-none"
            inputContainerClassName="bg-transparent focus-within:border-white !border-white"
            placeholder={inputPlaceholder || 'Enter your email'}
          />
          <CookiePreferencesNotice />
        </div>
      </div>
    </section>
  );
}
