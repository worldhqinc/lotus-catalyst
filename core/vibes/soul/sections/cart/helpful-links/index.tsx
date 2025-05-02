'use client';

import { ArrowRight, CircleHelp, PackageCheck } from 'lucide-react';

import { Link } from '~/components/link';

export function HelpfulLinks() {
  return (
    <div>
      <h2 className="text-2xl font-medium tracking-[1.8px] uppercase">Helpful links</h2>
      <ul className="divide-contrast-200 mt-2 divide-y">
        <li className="py-4">
          <Link
            className="ease-quad hover:text-primary flex items-center justify-between gap-4 transition-colors duration-200"
            href="/contact"
          >
            <span className="flex items-center gap-2">
              <CircleHelp className="size-4" />
              Contact Us
            </span>
            <ArrowRight className="size-4" />
          </Link>
        </li>
        <li className="py-4">
          <Link
            className="ease-quad hover:text-primary flex items-center justify-between gap-4 transition-colors duration-200"
            href="/returns"
          >
            <span className="flex items-center gap-2">
              <PackageCheck className="size-4" />
              Shipping & Returns
            </span>
            <ArrowRight className="size-4" />
          </Link>
        </li>
      </ul>
    </div>
  );
}
