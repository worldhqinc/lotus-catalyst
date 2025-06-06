import { Image } from '~/components/image';
import type { testimonials } from '~/contentful/schema';
import { ensureImageUrl } from '~/lib/utils';

export function Testimonials({ quote, logos }: testimonials['fields']) {
  return (
    <div className="bg-surface-secondary p-16">
      <blockquote className="font-heading text-icon-primary mx-auto mb-16 max-w-3xl text-center text-xl md:text-3xl">
        “{quote}”
      </blockquote>
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-8 md:grid md:grid-cols-5">
        {logos?.map((logo) => (
          <button
            className="ease-quad flex max-w-40 items-center justify-center opacity-50 transition-opacity duration-200 hover:opacity-100 md:max-w-none"
            key={logo.sys.id}
            type="button"
          >
            <Image
              alt={logo.fields.description || 'Logo'}
              className="h-12 w-auto object-contain"
              height={logo.fields.file.details.image?.height || 50}
              src={ensureImageUrl(logo.fields.file.url)}
              width={logo.fields.file.details.image?.width || 100}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
