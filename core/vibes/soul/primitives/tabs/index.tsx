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
  showAll?: boolean;
  allLabel?: string;
  allValue?: string;
}

const Tabs = ({
  defaultValue,
  triggers,
  content,
  className,
  showAll = false,
  allLabel = 'All',
  allValue = 'all',
}: TabsProps) => {
  const allTrigger = showAll ? [{ value: allValue, label: allLabel }] : [];
  const allContent = showAll
    ? [{ value: allValue, children: content.map((item) => item.children) }]
    : [];

  const combinedTriggers = [...allTrigger, ...triggers];
  const combinedContent = [...allContent, ...content];

  return (
    <TabsPrimitive.Root
      className={className}
      defaultValue={defaultValue || combinedTriggers[0]?.value}
    >
      <TabsPrimitive.List className="flex shrink-0 border-b border-border">
        {combinedTriggers.map((trigger) => (
          <TabsPrimitive.Trigger
            className="flex select-none items-center justify-center border-b border-transparent px-4 py-2 outline-none transition-colors duration-200 ease-quad hover:text-primary data-[state=active]:border-primary data-[state=active]:text-primary"
            key={trigger.value}
            value={trigger.value}
          >
            {trigger.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {combinedContent.map((item) => (
        <TabsPrimitive.Content className="grow" key={item.value} value={item.value}>
          {item.children}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
};

export default Tabs;
