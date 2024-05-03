'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { docEntries, DocItem } from '@/components/constants';
import { DocNavItem, DocNavItemProps } from './DocNavItem';

export interface DocNestedNavProps {
  docs: DocItem;
  defaultOpen: boolean;
  isActive?: DocNavItemProps['isActive'];
}

function DocNestedNav({ docs, defaultOpen, isActive }: DocNestedNavProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible defaultOpen={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full">
        <DocNavItem>
          {docs[0]?.category.label}
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </DocNavItem>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {docs.map(d => (
          <DocNavItem key={d._id} level={2} href={d.slug} isActive={isActive}>
            {d.title}
          </DocNavItem>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function DocNav() {
  const pathname = usePathname();
  return (
    <>
      {docEntries.map(([k, doc]) => {
        const isActive = (href: string) => href === pathname;

        if (doc.length === 1) {
          return (
            <DocNavItem key={k} href={doc[0].slug} isActive={isActive}>
              {doc[0].title}
            </DocNavItem>
          );
        }

        const open = doc.some(d => d.slug === pathname);
        return <DocNestedNav key={k} defaultOpen={open} docs={doc} isActive={isActive} />;
      })}
    </>
  );
}

export function DocNavBar() {
  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100%-3.5rem)] md:sticky md:block w-48">
      <ScrollArea className="relative overflow-hidden h-full py-6 pr-6 lg:py-8">
        <DocNav />
      </ScrollArea>
    </aside>
  );
}
