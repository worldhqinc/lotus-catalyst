'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { clsx } from 'clsx';
import { ChevronLeft, X } from 'lucide-react';
import React from 'react';

import { Button } from '../button';

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
  isMobileSidePanel?: boolean;
}

function Content({ title, children, isMobileSidePanel = false }: Props) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={clsx(
          'bg-foreground/50 @container fixed inset-0 z-30',
          isMobileSidePanel ? 'top-32 h-full w-full' : 'inset-y-0',
        )}
      >
        <Dialog.Content
          className={clsx(
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right fixed right-0 flex flex-col transition duration-500 [animation-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)]',
            isMobileSidePanel ? 'top-16 h-full w-full' : 'inset-y-0 w-96 max-w-full',
          )}
          forceMount
        >
          <div className="bg-background flex items-center justify-between gap-2 px-4 pt-4 pb-4 @md:px-8 @md:pt-7">
            {isMobileSidePanel ? (
              <div className="border-border w-full border-b pt-2 pb-6">
                <div className="relative flex items-center gap-3">
                  <Dialog.Close asChild>
                    <button className="after:absolute after:inset-0">
                      <ChevronLeft size={24} strokeWidth={1.5} />
                    </button>
                  </Dialog.Close>
                  <Dialog.Title asChild>
                    <span className="tracking-[1.28px] uppercase">{title}</span>
                  </Dialog.Title>
                </div>
              </div>
            ) : (
              <>
                <Dialog.Title asChild>
                  <div className="text-2xl font-medium @lg:text-3xl">{title}</div>
                </Dialog.Title>
                <Dialog.Close asChild>
                  <Button className="translate-x-3" shape="circle" size="small" variant="tertiary">
                    <X size={20} strokeWidth={1} />
                  </Button>
                </Dialog.Close>
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 @md:px-8 @md:pb-8">{children}</div>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  );
}

const Root = Dialog.Root;
const Trigger = Dialog.Trigger;

export { Root, Trigger, Content };
