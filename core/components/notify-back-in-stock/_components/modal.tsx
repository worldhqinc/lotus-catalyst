'use client';

import { getFormProps, getInputProps, SubmissionResult, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { clsx } from 'clsx';
import { useActionState, useEffect, useState } from 'react';

import { FormStatus } from '@/vibes/soul/form/form-status';
import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { Button } from '@/vibes/soul/primitives/button';
import { Modal } from '@/vibes/soul/primitives/modal';
import { toast } from '@/vibes/soul/primitives/toaster';

import { schema } from '../schema';

type Action<State, Payload> = (
  prevState: Awaited<State>,
  formData: Payload,
) => State | Promise<State>;

export default function NotifyBackInStockModal({
  action,
  productId,
  buttonLabel = 'Notify me',
  buttonClassName,
  buttonSize = 'medium',
}: {
  action: Action<
    {
      lastResult: SubmissionResult | null;
      successMessage?: string | null;
      errorMessage?: string | null;
    },
    FormData
  >;
  productId: string;
  buttonLabel?: string;
  buttonClassName?: string;
  buttonSize?: 'small' | 'medium';
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
    form.reset();
    setModalOpen(false);
  };

  useEffect(() => {
    if (lastResult?.status === 'success') {
      toast.success(successMessage);
      setModalOpen(false);
    }
  }, [lastResult, successMessage]);

  return (
    <>
      <Button
        className={clsx(buttonClassName, 'w-full')}
        onClick={() => setModalOpen(true)}
        size={buttonSize}
        type="button"
        variant="secondary"
      >
        {buttonLabel}
      </Button>
      <Modal
        className="w-[90%] @lg:w-120"
        isOpen={modalOpen}
        key={`notify-back-in-stock-modal-${productId}`}
        setOpen={setModalOpen}
        title="Notify me when available"
      >
        <p className="mb-6 text-sm text-gray-500">
          Enter your email address below to receive an update when this item becomes available.
        </p>
        <form {...getFormProps(form)} action={formAction} className="space-y-4">
          <input name="productId" type="hidden" value={productId} />
          <Label htmlFor="email">Email</Label>
          <Input
            {...getInputProps(fields.email, { type: 'email' })}
            key={fields.email.id}
            required
          />
          <div className="flex justify-end gap-4">
            <Button
              disabled={isPending}
              onClick={handleModalClose}
              type="button"
              variant="tertiary"
            >
              Cancel
            </Button>
            <Button disabled={isPending} loading={isPending} type="submit">
              Notify me
            </Button>
          </div>
          {form.status === 'success' && errorMessage ? (
            <FormStatus type="error">{errorMessage}</FormStatus>
          ) : null}
        </form>
      </Modal>
    </>
  );
}
