import { documentToHtmlString, Options } from '@contentful/rich-text-html-renderer';
import { Block, BLOCKS, Document, Inline, MARKS } from '@contentful/rich-text-types';
import { Metadata } from 'next';
import { createElement, ReactNode } from 'react';

import { cta } from '~/contentful/schema';

interface ContentfulImageDetails {
  image?: {
    width: number;
    height: number;
  };
}

interface ContentfulFile {
  url: string;
  details: ContentfulImageDetails;
}

interface ContentfulAsset {
  fields: {
    title: string;
    file: ContentfulFile;
  };
}

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

export function createContentfulRichTextOptions(scrollOffset = 90): Options {
  return {
    renderMark: {
      [MARKS.BOLD]: (text: string) => {
        const elementId = generateIdFromStrings([text]);

        return `<b id="${elementId}" style="scroll-margin-top: ${scrollOffset}px;">${text}</b>`;
      },
    },
    renderNode: {
      [BLOCKS.HEADING_6]: (node: Block | Inline, next) => {
        const html = next(node.content);
        const elementId = generateIdFromNodeContent(node);

        return `<h6 id="${elementId}" style="scroll-margin-top: ${scrollOffset}px;">${html}</h6>`;
      },
      'embedded-asset-block': (node: Block | Inline): string => {
        if (!isEmbeddedAsset(node)) return '';

        const { url, details } = node.data.target.fields.file;
        const { width, height } = details.image || {};
        const alt = node.data.target.fields.title || '';

        return `
          <div class="my-4 overflow-hidden">
            <Image
              src="https:${url}"
              alt="${alt}"
              width="${width || 'auto'}"
              height="${height || 'auto'}"
              class="h-auto w-full aspect-4/3 rounded-lg object-cover"
            />
          </div>
        `;
      },
    },
  };
}

export function generateHtmlFromRichText(doc: Document, scrollOffset = 90): string {
  const options = createContentfulRichTextOptions(scrollOffset);

  return documentToHtmlString(doc, options);
}

function isEmbeddedAsset(
  node: Block | Inline,
): node is Block & { data: { target: ContentfulAsset } } {
  return node.nodeType === BLOCKS.EMBEDDED_ASSET;
}

function generateIdFromStrings(text: string[]): string {
  return text
    .join(' ')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

function generateIdFromNodeContent(node: Block | Inline): string {
  return generateIdFromStrings(node.content.map((child) => ('value' in child ? child.value : '')));
}

export function formatTrademarkText(text: string): ReactNode {
  if (!text) return '';

  const parts = text.split(/(™)/g);

  return parts.map((part, index) =>
    part === '™'
      ? createElement('sup', { key: index, className: 'text-base align-super -top-1' }, '™')
      : part,
  );
}

export function getHreflangAlternates(rest: string[], locale: string): Metadata['alternates'] {
  return {
    languages: {
      'x-default': `/${locale}/${rest.join('/')}`,
      en: `/en/${rest.join('/')}`,
      es: `/es/${rest.join('/')}`,
      fr: `/fr/${rest.join('/')}`,
    },
  };
}
