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
