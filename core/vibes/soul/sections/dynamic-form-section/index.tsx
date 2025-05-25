import { DynamicForm, DynamicFormAction } from '@/vibes/soul/form/dynamic-form';
import { Field, FieldGroup } from '@/vibes/soul/form/dynamic-form/schema';

interface Props<F extends Field> {
  title?: string;
  subtitle?: string;
  action: DynamicFormAction<F>;
  fields: Array<F | FieldGroup<F>>;
  submitLabel?: string;
  benefits?: {
    title: string;
    items: string[];
  };
  isRegisterForm?: boolean;
}

export function DynamicFormSection<F extends Field>({
  title,
  subtitle,
  fields,
  submitLabel,
  action,
  benefits,
  isRegisterForm,
}: Props<F>) {
  return (
    <div className="@container px-4 py-8 xl:py-16 @xl:px-8">
      <div className="border-contrast-200 divide-contrast-200 mx-auto grid max-w-[1076px] grid-cols-1 divide-y rounded-lg border p-4 @xl:grid-cols-2 @xl:divide-x @xl:divide-y-0 @xl:p-8">
        <div className="flex w-full flex-col pb-4 @xl:pr-8 @xl:pb-0">
          {title != null && title !== '' && (
            <header className="mb-8">
              <h1 className="text-2xl leading-[120%] @5xl:text-4xl">{title}</h1>
              {subtitle != null && subtitle !== '' && (
                <p className="text-base leading-none font-light">{subtitle}</p>
              )}
              {isRegisterForm && (
                <p className="text-foreground mt-6 text-right text-sm">
                  Required Fields <span className="text-contrast-400">*</span>
                </p>
              )}
            </header>
          )}
          <DynamicForm
            action={action}
            fields={fields}
            isRegisterForm={isRegisterForm}
            submitLabel={submitLabel}
          />
        </div>
        <div className="flex w-full flex-col pt-4 @xl:pt-0 @xl:pl-8">
          <div>
            <h2 className="text-xl leading-[140%] font-medium">{benefits?.title}</h2>
          </div>
          {benefits != null && (
            <div>
              <ul className="text-contrast-400 mt-2 flex list-disc flex-col gap-y-2 ps-4">
                {benefits.items.map((item) => (
                  <li className="leading-[140%]" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
