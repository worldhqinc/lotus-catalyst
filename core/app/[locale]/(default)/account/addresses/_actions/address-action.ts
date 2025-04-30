import { SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';

import { Field, FieldGroup } from '@/vibes/soul/form/dynamic-form/schema';
import { Address, DefaultAddressConfiguration } from '@/vibes/soul/sections/address-list-section';
import { schema } from '@/vibes/soul/sections/address-list-section/schema';

import { createAddress } from './create-address';
import { deleteAddress } from './delete-address';
import { updateAddress } from './update-address';

export interface State {
  addresses: Address[];
  lastResult: SubmissionResult | null;
  defaultAddress?: DefaultAddressConfiguration;
  fields: Array<Field | FieldGroup<Field>>;
}

export async function addressAction(prevState: Awaited<State>, formData: FormData): Promise<State> {
  'use server';

  const intent = formData.get('intent');

  switch (intent) {
    case 'create': {
      return await createAddress(prevState, formData);
    }

    case 'update': {
      return await updateAddress(prevState, formData);
    }

    case 'delete': {
      return await deleteAddress(prevState, formData);
    }

    case 'setDefault': {
      const submission = parseWithZod(formData, { schema });

      if (submission.status !== 'success') {
        return {
          ...prevState,
          lastResult: submission.reply(),
        };
      }

      return {
        ...prevState,
        defaultAddress: { id: submission.value.id },
        lastResult: submission.reply({ resetForm: true }),
      };
    }

    default: {
      return prevState;
    }
  }
}
