import {
  CircleHelp,
  FileText,
  Heater,
  MessageSquarePlus,
  Package2,
  RefreshCw,
  SquarePen,
} from 'lucide-react';

import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Link } from '~/components/link';
import {
  pageStandardFieldsSchema,
  productSupportLinks,
  supportLinkFieldsSchema,
  supportLinkSchema,
} from '~/contentful/schema';

export function ProductSupportLinks({ title, links }: productSupportLinks['fields']) {
  const iconMap = (link: (typeof links)[number]) => {
    switch (link.fields.supportType) {
      case 'register-product':
        return <SquarePen size={40} strokeWidth={1} />;

      case 'warranty':
        return <FileText size={40} strokeWidth={1} />;

      case 'faqs':
        return <CircleHelp size={40} strokeWidth={1} />;

      case 'track-order':
        return <Package2 size={40} strokeWidth={1} />;

      case 'returns':
        return <RefreshCw size={40} strokeWidth={1} />;

      case 'use-and-care':
        return <Heater size={40} strokeWidth={1} />;

      case 'contact-us':
        return <MessageSquarePlus size={40} strokeWidth={1} />;

      default:
        return <CircleHelp size={40} strokeWidth={1} />;
    }
  };

  return (
    <SectionLayout>
      <h2 className="text-center text-4xl leading-[120%]">{title}</h2>
      <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
        {links.map((link) => {
          const supportPageLink = supportLinkSchema.parse(link);
          const supportPageLinkFields = supportLinkFieldsSchema.parse(supportPageLink.fields);
          const supportPageFields = pageStandardFieldsSchema.parse(
            supportPageLinkFields.supportPageLink.fields,
          );
          const supportPageSlug = supportPageFields.pageSlug;

          return (
            <li
              className="bg-contrast-100 relative flex flex-col items-center justify-start gap-6 rounded-lg p-4 text-center lg:p-8"
              key={link.sys.id}
            >
              <span className="inline-block self-center">{iconMap(link)}</span>
              <div>
                <Link
                  className="text-lg leading-[120%] font-medium tracking-[1.8px] uppercase after:absolute after:inset-0 md:text-2xl md:tracking-[2.4px]"
                  href={`/${supportPageSlug}`}
                >
                  {supportPageLinkFields.title}
                </Link>
                {supportPageLinkFields.subHeading ? (
                  <p className="text-contrast-400 hidden lg:block">
                    {supportPageLinkFields.subHeading}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </SectionLayout>
  );
}
