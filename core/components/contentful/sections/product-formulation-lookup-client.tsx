'use client';

import { useSearchParams } from 'next/navigation';

import { Select } from '@/vibes/soul/form/select';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { useRouter } from '~/i18n/routing';

export interface ProductFormulationLookupClientProps {
  title?: string;
  disclaimerHtml: string;
  productOptions: Array<{ label: string; value: string }>;
  selectedSku: string;
  formulationInfo: ProductFormulationInformation | null;
}

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

export interface ProductFormulationInformation {
  AB1200?: AB1200Entry[];
}

function renderAuthoritativeLists(lists: AuthoritativeList | AuthoritativeList[] | undefined) {
  if (Array.isArray(lists)) {
    return (
      <ul className="ml-4 list-disc">
        {lists.map((list, idx) => (
          <li key={idx}>
            <a className="underline" href={list['@href']} rel="noopener noreferrer" target="_blank">
              {list['#text']}
            </a>
          </li>
        ))}
      </ul>
    );
  } else if (lists && typeof lists === 'object') {
    return (
      <ul className="ml-4 list-disc">
        <li>
          <a className="underline" href={lists['@href']} rel="noopener noreferrer" target="_blank">
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
    <div className="space-y-6">
      {chemicals.map((chem, idx) => {
        const names = Object.keys(chem);

        if (names.length === 0) return null;

        const name = names[0];

        if (!name) return null;

        const data = chem[name];

        if (!data) return null;

        return (
          <div key={`${name}-${idx}`}>
            <h3 className="mb-1 text-lg font-semibold">{name}</h3>
            {!!data.url && (
              <div className="mb-1">
                <a
                  className="text-blue-700 underline"
                  href={data.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Reference
                </a>
              </div>
            )}
            {data.authoritative_lists && (
              <div>
                <div className="font-medium">Authoritative Lists Referencing this Chemical:</div>
                {renderAuthoritativeLists(data.authoritative_lists)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ProductFormulationLookupClient({
  title,
  disclaimerHtml,
  productOptions,
  formulationInfo,
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
    formulationInfo &&
    Array.isArray(formulationInfo.AB1200) &&
    formulationInfo.AB1200.length > 0
  ) {
    const ab = formulationInfo.AB1200[0];

    if (ab?.chemicals) {
      ab1200Content = (
        <div className="mb-8">
          <div>
            <h2 className="mb-4 text-xl font-bold">The product above contains</h2>
            {renderChemicals(ab.chemicals)}
          </div>
        </div>
      );
    }
  }

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
        <div className="mb-10">{ab1200Content}</div>
        <div className="prose space-y-6" dangerouslySetInnerHTML={{ __html: disclaimerHtml }} />
      </div>
    </SectionLayout>
  );
}
