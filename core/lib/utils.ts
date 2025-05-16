import { cta } from '~/contentful/schema';

export function exists<T>(value: T | null | undefined): value is T {
  return value != null;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function ensureImageUrl(url: string) {
  if (!url) return '';

  if (url.startsWith('//')) {
    return `https:${url}`;
  }

  return url;
}

export async function downloadFile(url: string, filename?: string): Promise<void> {
  if (!url) return;

  try {
    // Fetch the file
    const response = await fetch(url);
    const blob = await response.blob();

    // Create a blob URL and trigger download
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = blobUrl;
    a.download = filename || url.split('/').pop() || 'download';
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    // Fallback to opening in new tab
    window.open(url, '_blank');
  }
}

export function getLinkHref(fields: cta['fields']) {
  let linkHref = '#';

  const { internalReference, externalLink } = fields;

  if (internalReference) {
    if (
      internalReference.fields.pageSlug &&
      typeof internalReference.fields.pageSlug === 'string'
    ) {
      linkHref = `/${internalReference.fields.pageSlug}`;
    }
  } else if (externalLink) {
    linkHref = externalLink;
  }

  return linkHref;
}
