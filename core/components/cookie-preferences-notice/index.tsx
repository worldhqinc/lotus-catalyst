import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import { contentfulClient } from '~/lib/contentful';
import { isString } from '~/lib/utils';

export default async function CookiePreferencesNotice() {
  const entry = await contentfulClient.getEntry('7zFJPfQgnNb9EvITwjhvf');

  const subtitle = entry.fields.subtitle;
  const subtitleRichTextDocument =
    subtitle && isString(subtitle) ? await richTextFromMarkdown(subtitle) : null;
  const subtitleHtml = subtitleRichTextDocument
    ? documentToHtmlString(subtitleRichTextDocument)
    : '';

  return (
    <div
      className="msg-to-opt-out-users"
      dangerouslySetInnerHTML={{ __html: subtitleHtml }}
      style={{ display: 'none' }}
    />
  );
}
