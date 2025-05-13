import { z } from 'zod';

import { InlineEmailForm } from '@/vibes/soul/primitives/inline-email-form';
import CookiePreferencesNotice from '~/components/cookie-preferences-notice';
import { subscribe } from '~/components/subscribe/_actions/subscribe';
import { newsletterFormSchema } from '~/contentful/schema';

export function NewsletterForm({
  title,
  description,
  inputPlaceholder,
}: z.infer<typeof newsletterFormSchema>['fields']) {
  return (
    <section className="bg-primary text-background py-28 text-center">
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
