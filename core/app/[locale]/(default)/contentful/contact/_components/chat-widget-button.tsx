'use client';

import { Button } from '@/vibes/soul/primitives/button';

export function ChatWidgetButton() {
  return (
    <Button className="w-full md:w-auto" onClick={() => zE('messenger', 'open')} size="medium">
      Message us
    </Button>
  );
}
