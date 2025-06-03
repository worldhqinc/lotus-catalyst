import { Badge } from '@/vibes/soul/primitives/badge';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { ensureImageUrl, formatTrademarkText } from '~/lib/utils';

interface CardProps {
  categories: string[];
  image:
    | {
        fields: {
          file: {
            url: string;
            details: {
              image: {
                height: number;
                width: number;
              };
            };
          };
        };
      }
    | undefined;
  pageSlug: string;
  recipeName: string;
  shortDescription: string;
}

export function Card({ categories, image, pageSlug, recipeName, shortDescription }: CardProps) {
  return (
    <article className="group relative max-h-max">
      <figure className="bg-contrast-200 relative aspect-[4/3] overflow-hidden rounded-lg">
        {image && (
          <Image
            alt={recipeName}
            className="ease-quad h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            height={image.fields.file.details.image.height}
            src={ensureImageUrl(image.fields.file.url)}
            width={image.fields.file.details.image.width}
          />
        )}
      </figure>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="ease-quad group-hover:text-primary text-surface-foreground font-heading text-3xl transition-colors duration-200">
          {formatTrademarkText(recipeName)}
        </h3>
        <p className="text-contrast-400 text-sm">{shortDescription}</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {categories.map((category) => (
          <Badge key={category}>{category}</Badge>
        ))}
      </div>
      <Link className="absolute inset-0" href={`/${pageSlug}`}>
        <span className="sr-only">View {recipeName}</span>
      </Link>
    </article>
  );
}
