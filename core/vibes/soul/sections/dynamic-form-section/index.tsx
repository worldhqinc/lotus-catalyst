import { clsx } from 'clsx';

import { DynamicForm, DynamicFormAction } from '@/vibes/soul/form/dynamic-form';
import { Field, FieldGroup } from '@/vibes/soul/form/dynamic-form/schema';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';

interface Props<F extends Field> {
  title?: string;
  subtitle?: string;
  action: DynamicFormAction<F>;
  fields: Array<F | FieldGroup<F>>;
  submitLabel?: string;
  className?: string;
}

export function DynamicFormSection<F extends Field>({
  className,
  title,
  subtitle,
  fields,
  submitLabel,
  action,
}: Props<F>) {
  return (
    <SectionLayout className={clsx('px-3 py-10 @xl:px-6 @4xl:py-16 @5xl:px-16', className)} containerSize="lg">
      {title != null && title !== '' && (
        <header className="pb-8 @2xl:pb-12 @4xl:pb-16">
          <h1 className="font-heading mb-5 text-4xl leading-none font-medium @xl:text-5xl">
            {title}
          </h1>
          {subtitle != null && subtitle !== '' && (
            <p className="mb-10 text-base leading-none font-light @xl:text-lg">{subtitle}</p>
          )}
        </header>
      )}
      <div className="flex flex-col justify-center gap-y-4 @4xl:flex-row @4xl:gap-x-4 @5xl:gap-x-8">
        <div className="border-contrast-200 flex w-full flex-col rounded-lg border p-4 @xl:max-w-md @5xl:p-8">
          <DynamicForm action={action} fields={fields} submitLabel={submitLabel} />
        </div>
        <div className="border-contrast-200 flex w-full flex-col rounded-lg border p-4 @xl:max-w-md @5xl:p-8">
          benefits
        </div>
      </div>
    </SectionLayout>
  );
}
