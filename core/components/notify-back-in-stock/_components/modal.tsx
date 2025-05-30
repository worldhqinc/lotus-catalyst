'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { clsx } from 'clsx';
import { XIcon } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';

import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { Button } from '@/vibes/soul/primitives/button';
import { toast } from '@/vibes/soul/primitives/toaster';

import { schema } from '../schema';

type Action<State, Payload> = (
  prevState: Awaited<State>,
  formData: Payload,
) => State | Promise<State>;

export default function NotifyBackInStockModal({
  action,
  sku,
  buttonLabel = 'Notify me',
  buttonClassName,
  buttonSize = 'small',
  textCta = false,
}: {
  action: Action<
    {
      lastResult: SubmissionResult | null;
      successMessage?: string | null;
      errorMessage?: string | null;
    },
    FormData
  >;
  sku: string;
  buttonLabel?: string;
  buttonClassName?: string;
  buttonSize?: 'small' | 'medium';
  textCta?: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [{ lastResult, successMessage, errorMessage }, formAction, isPending] = useActionState(
    action,
    {
      lastResult: null,
      successMessage: null,
      errorMessage: null,
    },
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  const handleModalClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setModalOpen(false);
    }
  }, [lastResult, successMessage]);

  return (
    <Dialog.Root onOpenChange={setModalOpen} open={modalOpen}>
      <Dialog.Trigger asChild>
        {textCta ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="text-sm">Coming soon</span>
            <Button
              className="text-contrast-400 underline [&_span]:text-sm"
              size="link"
              type="button"
              variant="link"
            >
              Notify me!
            </Button>
          </div>
        ) : (
          <Button
            className={clsx(buttonClassName, 'w-full')}
            size={buttonSize}
            type="button"
            variant="secondary"
          >
            {buttonLabel}
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="@container fixed inset-0 z-51 flex items-center justify-center bg-[var(--modal-overlay-background,hsl(var(--foreground)/50%))]">
          <Dialog.Content
            className={clsx(
              'mx-3 my-10 max-h-[90%] w-[90%] max-w-3xl overflow-y-auto rounded-2xl bg-[var(--modal-background,hsl(var(--background)))] @lg:w-120',
              'transition ease-out',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:duration-200',
              'data-[state=closed]:slide-out-to-bottom-16 data-[state=open]:slide-in-from-bottom-16 focus:outline-hidden',
            )}
          >
            <div className="flex flex-col">
              <div className="flex min-h-10 flex-row items-center pt-6 pl-5">
                <Dialog.Title asChild>
                  <h1 className="flex-1 pr-4 text-base leading-none font-semibold">
                    Notify me when available
                  </h1>
                </Dialog.Title>
                <div className="flex items-center justify-center pr-3">
                  <Dialog.Close asChild>
                    <Button shape="circle" size="x-small" variant="ghost">
                      <XIcon size={20} />
                    </Button>
                  </Dialog.Close>
                </div>
              </div>
              <div className="my-6 flex-1 px-6 text-pretty">
                <p className="mb-6 text-sm text-gray-500">
                  Enter your email address below to receive an update when this item becomes
                  available.
                </p>
                <form {...getFormProps(form)} action={formAction} className="space-y-4">
                  <div className="flex items-end justify-end">
                    <p className="text-foreground text-sm">
                      Required Fields <span className="text-contrast-400">*</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <input name="sku" type="hidden" value={sku} />
                    <Label className="text-foreground text-sm font-medium" htmlFor="email">
                      Email <span>*</span>
                    </Label>
                    <Input
                      {...getInputProps(fields.email, { type: 'email' })}
                      className={clsx(
                        fields.email.errors && fields.email.errors.length > 0 && 'border-error',
                      )}
                      errors={fields.email.errors}
                      key={fields.email.id}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button
                      disabled={isPending}
                      onClick={handleModalClose}
                      size="medium"
                      type="button"
                      variant="tertiary"
                    >
                      Cancel
                    </Button>
                    <Button disabled={isPending} loading={isPending} size="medium" type="submit">
                      Notify me
                    </Button>
                  </div>
                  {form.status === 'success' && errorMessage ? (
                    <FormStatus type="error">{errorMessage}</FormStatus>
                  ) : null}
                </form>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
