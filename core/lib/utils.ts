import { cta, pageStandardSchema } from '~/contentful/schema';

export function exists<T>(value: T | null | undefined): value is T {
  return value != null;
}

export function ensureImageUrl(url: string) {
  if (!url) return '';

  if (url.startsWith('//')) {
    return `https:${url}`;
  }

  return url;
}

export function getLinkHref({ fields }: cta) {
  let linkHref = '#';

  const { internalReference, externalLink } = fields;

  if (internalReference) {
    const type = internalReference.sys.contentType.sys.id;

    if (type === 'pageStandard') {
      try {
        const page = pageStandardSchema.parse(internalReference);

        linkHref = page.fields.pageSlug ? `/${page.fields.pageSlug}` : '#';
      } catch {
        // parse error, keep default
      }
    } else {
      linkHref = '/not-implemented';
    }
  } else if (externalLink) {
    linkHref = externalLink;
  }

  return linkHref;
}
