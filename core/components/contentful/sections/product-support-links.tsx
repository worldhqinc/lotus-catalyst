import { CircleHelp, FileText, Heater, Package2, RefreshCw, SquarePen } from 'lucide-react';

import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { auth } from '~/auth';
import { Link } from '~/components/link';
import {
  pageStandardFieldsSchema,
  productSupportLinks,
  supportLinkFieldsSchema,
  supportLinkSchema,
} from '~/contentful/schema';

export async function ProductSupportLinks({ title, links }: productSupportLinks['fields']) {
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

      default:
        return <CircleHelp size={40} strokeWidth={1} />;
    }
  };

  const session = await auth();

  return (
    <SectionLayout>
      <h2 className="text-center text-4xl leading-[120%]">{title}</h2>
      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
        {links.map((link) => {
          const supportPageLink = supportLinkSchema.parse(link);
          const supportPageLinkFields = supportLinkFieldsSchema.parse(supportPageLink.fields);
          const supportPageFields = pageStandardFieldsSchema.parse(
            supportPageLinkFields.supportPageLink.fields,
          );
          const supportPageSlug = supportPageFields.pageSlug;

          return (
            <li
              className="bg-contrast-100 relative flex flex-col items-center justify-center gap-8 rounded-lg p-8 text-center"
              key={link.sys.id}
            >
              {iconMap(link)}
              <div>
                <Link
                  className="text-lg leading-[120%] font-medium tracking-[1.8px] uppercase after:absolute after:inset-0 md:text-2xl md:tracking-[2.4px]"
                  href={`/${supportPageSlug}`}
                >
                  {supportPageLinkFields.title}
                </Link>
                {supportPageLinkFields.supportType === 'track-order' && (
                  <p className="text-contrast-400">
                    or{' '}
                    <Link
                      className="link text-primary"
                      href={
                        session?.user?.customerAccessToken
                          ? '/account/orders'
                          : '/login?redirectTo=/account/orders'
                      }
                    >
                      look up an order
                    </Link>
                  </p>
                )}
                {supportPageLinkFields.supportType === 'returns' && (
                  <p className="text-contrast-400">
                    View our{' '}
                    <Link className="link text-primary" href="/returns">
                      Return Policy
                    </Link>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </SectionLayout>
  );
}
