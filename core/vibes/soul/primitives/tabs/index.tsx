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
    <TabsPrimitive.List className="border-mauve6 flex shrink-0 border-b">
      {triggers.map((trigger) => (
        <TabsPrimitive.Trigger
          className="text-mauve11 hover:text-violet11 data-[state=active]:text-violet11 flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none outline-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
          key={trigger.value}
          value={trigger.value}
        >
          {trigger.label}
        </TabsPrimitive.Trigger>
      ))}
    </TabsPrimitive.List>
    {content.map((item) => (
      <TabsPrimitive.Content
        className="grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        key={item.value}
        value={item.value}
      >
        {item.children}
      </TabsPrimitive.Content>
    ))}
  </TabsPrimitive.Root>
);

export default Tabs;
