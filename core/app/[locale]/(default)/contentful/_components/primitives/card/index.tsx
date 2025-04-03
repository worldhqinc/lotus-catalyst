import { Badge } from '@/vibes/soul/primitives/badge';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

interface CardProps {
  categories: string[];
  image: {
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
  };
  pageSlug: string;
  recipeName: string;
  shortDescription: string;
}

export default function Card({
  categories,
  image,
  pageSlug,
  recipeName,
  shortDescription,
}: CardProps) {
  const ensureImageUrl = (url: string) => {
    if (!url) return '';

    if (url.startsWith('//')) {
      return `https:${url}`;
    }

    return url;
  };

  return (
    <article className="group relative max-h-max">
      <figure className="bg-surface-image relative aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          alt={recipeName}
          className="h-full w-full object-cover"
          height={image.fields.file.details.image.height}
          src={ensureImageUrl(image.fields.file.url)}
          width={image.fields.file.details.image.width}
        />
      </figure>
      <div className="mt-2 flex flex-col gap-1">
        <h3 className="ease-quad group-hover:text-primary text-3xl transition-colors duration-200">
          {recipeName}
        </h3>
        <p className="text-neutral-500">{shortDescription}</p>
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
