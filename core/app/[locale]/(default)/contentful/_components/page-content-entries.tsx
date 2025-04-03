import { PageStandardPageContentField } from '../[...rest]/page-data';

export default function PageContentEntries({
  pageContent,
}: {
  pageContent: PageStandardPageContentField[];
}) {
  return (
    <div>
      {Array.isArray(pageContent) &&
        pageContent.map((field: PageStandardPageContentField) => (
          <div key={field.sys.id}>
            {field.sys.contentType.sys.id === 'button' ? (
              <div key={field.sys.id}>Button Display Component</div>
            ) : null}
            {field.sys.contentType.sys.id === 'faq' ? (
              <div key={field.sys.id}>FAQ Display Component</div>
            ) : null}
          </div>
        ))}
    </div>
  );
}
