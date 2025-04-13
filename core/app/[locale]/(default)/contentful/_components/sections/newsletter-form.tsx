import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/vibes/soul/primitives/button';
import { newsletterFormSchema } from '~/contentful/schema';

export default function NewsletterForm({
  title,
  description,
  inputPlaceholder,
}: z.infer<typeof newsletterFormSchema>['fields']) {
  return (
    <section className="bg-primary text-background py-28 text-center">
      <div className="container mx-auto px-4">
        <h2 className="mx-auto mb-4 max-w-xl font-serif text-5xl uppercase">{title}</h2>
        <p className="mx-auto mb-16 max-w-2xl">{description}</p>
        <form className="mx-auto max-w-md">
          <div
            className={clsx(
              'relative rounded-none border bg-transparent text-base transition-colors duration-200 focus-within:border-white focus:outline-none',
              'border-background border-x-0 border-t-0 border-b',
            )}
          >
            <input
              className="h-16 w-full bg-transparent pr-16 pl-6 text-white placeholder-white placeholder:font-normal focus:outline-none"
              placeholder={inputPlaceholder || 'Enter your email'}
              type="email"
            />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 pr-0">
              <Button
                aria-label="Submit newsletter"
                className="border-background !text-background hover:!bg-background hover:!text-primary border"
                shape="circle"
                size="medium"
                type="submit"
                variant="ghost"
              >
                <ArrowRight size={20} strokeWidth={1.5} />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
