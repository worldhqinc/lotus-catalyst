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
    <div className="@container">
      <div className="flex flex-col justify-center gap-y-4 px-3 py-10 @xl:flex-row @xl:gap-x-4 @xl:px-6 @4xl:gap-x-8 @4xl:py-16 @5xl:px-16">
        <div className="border-contrast-200 flex w-full flex-col rounded-lg border p-4 @xl:max-w-md @5xl:p-8">
          {title != null && title !== '' && (
            <header className="mb-8">
              <h1 className="text-2xl leading-[120%] @5xl:text-4xl">{title}</h1>
              {subtitle != null && subtitle !== '' && (
                <p className="text-base leading-none font-light">{subtitle}</p>
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
        <div className="border-contrast-200 flex w-full flex-col rounded-lg border p-4 @xl:max-w-md @5xl:p-8">
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
