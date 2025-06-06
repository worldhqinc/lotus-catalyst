import * as Dialog from '@radix-ui/react-dialog';
import { clsx } from 'clsx';
import { XIcon } from 'lucide-react';

import { Button } from '@/vibes/soul/primitives/button';

export interface ModalProps extends React.PropsWithChildren {
  className?: string;
  isOpen?: boolean;
  setOpen?: (open: boolean) => void;
  /** Title should always be given for screen reader support. */
  title: string;
  /** Element to trigger the modal. Not required if the modal is being controlled manually. */
  trigger?: React.ReactNode;
  /** If `true`, a user will be required to make a choice by clicking on one of the provided actions. Defaults to `false`. */
  required?: boolean;
  /** Hides the header / top of the modal. */
  hideHeader?: boolean;
  /** Description for screen reader support. */
  description?: string;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --modal-background: hsl(var(--background));
 *   --modal-overlay-background: hsl(var(--foreground)/50%);
 * }
 * ```
 */
export const Modal = ({
  className = '',
  isOpen,
  setOpen,
  title,
  trigger,
  children,
  required = false,
  hideHeader = false,
  description,
}: ModalProps) => {
  return (
    <Dialog.Root onOpenChange={setOpen} open={isOpen}>
      {trigger != null && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="@container fixed inset-0 z-30 flex items-center justify-center bg-[var(--modal-overlay-background,hsl(var(--foreground)/50%))]">
          <Dialog.Content
            aria-describedby={description || undefined}
            className={clsx(
              'mx-3 my-10 max-h-[90%] max-w-3xl overflow-y-auto rounded-2xl bg-[var(--modal-background,hsl(var(--background)))]',
              'transition ease-out',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:duration-200',
              'data-[state=closed]:slide-out-to-bottom-16 data-[state=open]:slide-in-from-bottom-16 focus:outline-hidden',
              className,
            )}
            onEscapeKeyDown={required ? (event) => event.preventDefault() : undefined}
            onInteractOutside={required ? (event) => event.preventDefault() : undefined}
            onPointerDownOutside={required ? (event) => event.preventDefault() : undefined}
          >
            <div className="flex flex-col">
              <div
                className={clsx(
                  'flex min-h-10 flex-row items-center pt-6 pl-5',
                  hideHeader ? 'sr-only' : '',
                )}
              >
                <Dialog.Title asChild>
                  <h2 className="flex-1 pr-4 text-base leading-[150%] font-medium">{title}</h2>
                </Dialog.Title>
                {!(required || hideHeader) && (
                  <div className="flex items-center justify-center pr-3">
                    <Dialog.Close asChild>
                      <Button shape="circle" size="x-small" variant="ghost">
                        <XIcon size={20} />
                      </Button>
                    </Dialog.Close>
                  </div>
                )}
              </div>
              <div className="my-6 flex-1 px-6">{children}</div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
