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
  const allTrigger = React.useMemo(
    () => (showAll ? [{ value: allValue, label: allLabel }] : []),
    [showAll, allValue, allLabel],
  );
  const allContent = React.useMemo(
    () => (showAll ? [{ value: allValue, children: content.map((item) => item.children) }] : []),
    [showAll, allValue, content],
  );

  const combinedTriggers = React.useMemo(
    () => [...allTrigger, ...triggers],
    [allTrigger, triggers],
  );
  const combinedContent = React.useMemo(() => [...allContent, ...content], [allContent, content]);

  const triggerRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  const moveIndicator = (value: string) => {
    const element = triggerRefs.current.get(value);

    if (element) {
      const width = element.offsetWidth;

      element.parentElement?.style.setProperty('--trigger-width', `${width}px`);

      const left = element.offsetLeft;

      element.parentElement?.style.setProperty('--trigger-left', `${left}px`);
    }
  };

  React.useEffect(() => {
    const firstValue = defaultValue || combinedTriggers[0]?.value;

    if (firstValue) {
      moveIndicator(firstValue);
    }
  }, [defaultValue, combinedTriggers]);

  return (
    <TabsPrimitive.Root
      className={className}
      defaultValue={defaultValue || combinedTriggers[0]?.value}
    >
      <TabsPrimitive.List className="tabs-list relative flex shrink-0 border-b border-border after:absolute after:bottom-0 after:left-[var(--trigger-left)] after:h-px after:w-[var(--trigger-width)] after:bg-foreground after:transition-[left,_width] after:duration-200 after:ease-quad">
        {combinedTriggers.map((trigger) => (
          <TabsPrimitive.Trigger
            className="flex select-none items-center justify-center px-4 py-2 text-neutral-500 outline-none transition-colors duration-200 ease-quad hover:text-foreground data-[state=active]:text-foreground"
            key={trigger.value}
            onClick={() => moveIndicator(trigger.value)}
            ref={(element) => {
              if (element) {
                triggerRefs.current.set(trigger.value, element);
              }
            }}
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
