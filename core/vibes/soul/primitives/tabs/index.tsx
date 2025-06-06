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
  const [activeValue, setActiveValue] = React.useState(defaultValue || combinedTriggers[0]?.value);

  const moveIndicator = React.useCallback((value: string) => {
    requestAnimationFrame(() => {
      const element = triggerRefs.current.get(value);

      if (element) {
        const width = element.offsetWidth;
        const left = element.offsetLeft;
        const parent = element.parentElement;

        if (parent) {
          parent.style.setProperty('--trigger-width', `${width}px`);
          parent.style.setProperty('--trigger-left', `${left}px`);
        }
      }
    });
  }, []);

  React.useEffect(() => {
    if (activeValue) {
      moveIndicator(activeValue);
    }
  }, [activeValue, moveIndicator]);

  return (
    <TabsPrimitive.Root
      className={className}
      defaultValue={activeValue}
      onValueChange={(value) => {
        setActiveValue(value);
        moveIndicator(value);
      }}
    >
      <TabsPrimitive.List className="tabs-list scrollbar-hidden border-border after:bg-foreground after:ease-quad relative flex shrink-0 overflow-x-auto border-b after:absolute after:bottom-0 after:left-[var(--trigger-left)] after:h-px after:w-[var(--trigger-width)] after:transition-[left,_width] after:duration-200">
        {combinedTriggers.map((trigger) => (
          <TabsPrimitive.Trigger
            className="ease-quad hover:text-foreground data-[state=active]:text-icon-primary text-icon-secondary flex items-center justify-center px-4 py-2 text-lg transition-colors duration-200 outline-none select-none data-[state=active]:font-medium"
            key={trigger.value}
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
