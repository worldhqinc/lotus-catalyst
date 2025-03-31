import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

interface TabsProps {
  defaultValue?: string;
  triggers: Array<{
    value: string;
    label: string;
  }>;
  content: Array<{
    value: string;
    children: React.ReactNode;
  }>;
  className?: string;
}

const Tabs = ({ defaultValue, triggers, content, className }: TabsProps) => (
  <TabsPrimitive.Root className={className} defaultValue={defaultValue || triggers[0]?.value}>
    <TabsPrimitive.List className="flex shrink-0 border-b border-border">
      {triggers.map((trigger) => (
        <TabsPrimitive.Trigger
          className="flex h-[45px] flex-1 select-none items-center justify-center border-b border-transparent outline-none data-[state=active]:border-primary data-[state=active]:text-primary"
          key={trigger.value}
          value={trigger.value}
        >
          {trigger.label}
        </TabsPrimitive.Trigger>
      ))}
    </TabsPrimitive.List>
    {content.map((item) => (
      <TabsPrimitive.Content className="grow" key={item.value} value={item.value}>
        {item.children}
      </TabsPrimitive.Content>
    ))}
  </TabsPrimitive.Root>
);

export default Tabs;
