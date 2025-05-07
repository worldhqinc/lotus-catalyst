'use client';

import { useSearchParams } from 'next/navigation';

import { Select } from '@/vibes/soul/form/select';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { Asset, productFinishedGoods } from '~/contentful/schema';
import { useRouter } from '~/i18n/routing';
import { ensureImageUrl } from '~/lib/utils';

interface AuthoritativeList {
  '#text': string;
  '@href': string;
}

interface ChemicalData {
  url?: string;
  authoritative_lists?: AuthoritativeList | AuthoritativeList[];
}

type Chemical = Record<string, ChemicalData>;

interface AB1200Entry {
  brand?: string;
  status?: string;
  chemicals?: Chemical[];
}

interface ProductFormulationInformation {
  AB1200?: AB1200Entry[] | null;
}

function isProductFormulationInformation(obj: unknown): obj is ProductFormulationInformation {
  return !!obj && typeof obj === 'object' && 'AB1200' in obj;
}

function renderAuthoritativeLists(lists: AuthoritativeList | AuthoritativeList[] | undefined) {
  if (Array.isArray(lists)) {
    return (
      <ul className="space-y-6">
        {lists.map((list, idx) => (
          <li key={idx}>
            <a
              className="text-primary"
              href={list['@href']}
              rel="noopener noreferrer"
              target="_blank"
            >
              {list['#text']}
            </a>
          </li>
        ))}
      </ul>
    );
  } else if (lists && typeof lists === 'object') {
    return (
      <ul className="space-y-6">
        <li>
          <a
            className="text-primary"
            href={lists['@href']}
            rel="noopener noreferrer"
            target="_blank"
          >
            {lists['#text']}
          </a>
        </li>
      </ul>
    );
  }

  return null;
}

function renderChemicals(chemicals: Chemical[] | undefined) {
  if (!chemicals) return null;

  return (
    <div className="divide-contrast-200 border-contrast-200 space-y-12 divide-y border-b">
      {chemicals.map((chem, idx) => {
        const names = Object.keys(chem);

        if (names.length === 0) return null;

        const name = names[0];

        if (!name) return null;

        const data = chem[name];

        if (!data) return null;

        return (
          <div className="space-y-6 pb-12" key={`${name}-${idx}`}>
            <a href={data.url} rel="noopener noreferrer" target="_blank">
              <h3 className="text-surface-foreground text-xl font-medium">{name}</h3>
            </a>
            {data.authoritative_lists && (
              <div>
                <div className="text-contrast-400 mb-6">
                  Authoritative Lists Referencing this Chemical:
                </div>
                {renderAuthoritativeLists(data.authoritative_lists)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface ProductFormulationLookupClientProps {
  title?: string;
  disclaimerHtml: string;
  productOptions: Array<{
    label: string;
    value: string;
    featuredImage?: Asset | null;
    pageSlug?: string | null;
    parentCategory?: string | null;
    subCategory?: string | null;
  }>;
  selectedSku: string;
  selectedProductFields?: productFinishedGoods['fields'] | null;
}

export function ProductFormulationLookupClient({
  title,
  disclaimerHtml,
  productOptions,
  selectedProductFields,
}: ProductFormulationLookupClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (sku: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('selectedSku', sku);
    router.replace(`?${params.toString()}`);
  };

  // Render the AB1200 chemicals if present
  let ab1200Content = null;

  if (
    selectedProductFields &&
    isProductFormulationInformation(selectedProductFields.productFormulationInformation) &&
    selectedProductFields.productFormulationInformation.AB1200 &&
    selectedProductFields.productFormulationInformation.AB1200.length > 0
  ) {
    const ab = selectedProductFields.productFormulationInformation.AB1200[0];

    if (ab?.chemicals) {
      ab1200Content = (
        <div className="mb-8">
          <div>
            <h2 className="text-surface-foreground mb-10 text-2xl font-medium uppercase">
              The product above contains
            </h2>
            {renderChemicals(ab.chemicals)}
          </div>
        </div>
      );
    }
  }

  // Product card for the selected product
  const productCard = selectedProductFields ? (
    <div className="border-contrast-200 mb-8 flex items-center rounded-lg border p-4">
      <div className="bg-contrast-200 mr-4 h-16 w-16 overflow-hidden rounded">
        {selectedProductFields.featuredImage?.fields.file.url ? (
          <Image
            alt={selectedProductFields.productName}
            className="size-full object-cover"
            height={selectedProductFields.featuredImage.fields.file.details.image?.height ?? 64}
            src={ensureImageUrl(selectedProductFields.featuredImage.fields.file.url)}
            width={selectedProductFields.featuredImage.fields.file.details.image?.width ?? 64}
          />
        ) : null}
      </div>
      <div>
        <div className="text-surface-foreground font-medium">
          {selectedProductFields.pageSlug ? (
            <Link href={`/${selectedProductFields.pageSlug}`}>
              {selectedProductFields.productName}
            </Link>
          ) : (
            selectedProductFields.productName
          )}
        </div>
        {(selectedProductFields.parentCategory || selectedProductFields.subCategory) && (
          <p className="text-contrast-400 mt-2 text-sm">
            {[selectedProductFields.parentCategory, selectedProductFields.subCategory]
              .filter(Boolean)
              .join(' and ')}
          </p>
        )}
      </div>
    </div>
  ) : null;

  return (
    <SectionLayout className="bg-contrast-100">
      <div className="mx-auto max-w-3xl rounded bg-white p-12">
        <h2 className="mb-8 text-4xl">{title}</h2>
        <div className="mb-10">
          <Select
            aria-label="Select a product"
            className="flex-1"
            name="productSku"
            onValueChange={handleSelect}
            options={productOptions}
            placeholder="Select a product"
            value={searchParams.get('selectedSku') ?? ''}
          />
        </div>
        <div className="mb-10">
          {productCard}
          {ab1200Content}
        </div>
        <div className="prose space-y-6" dangerouslySetInnerHTML={{ __html: disclaimerHtml }} />
      </div>
    </SectionLayout>
  );
}
