'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { docEntries, DocItem } from '@/components/constants';
import { SidebarItem, SidebarItemProps } from '@/components/Sidebar/SidebarItem';

export interface DocNestedNavProps {
  docs: DocItem;
  defaultOpen: boolean;
  isActive?: SidebarItemProps['isActive'];
}

function DocNestedNav({ docs, defaultOpen, isActive }: DocNestedNavProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible defaultOpen={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full">
        <SidebarItem>
          {docs[0]?.category.label}
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </SidebarItem>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {docs.map(d => (
          <SidebarItem key={d._id} level={2} href={d.slug} isActive={isActive}>
            {d.title}
          </SidebarItem>
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
            <SidebarItem key={k} href={doc[0].slug} isActive={isActive}>
              {doc[0].title}
            </SidebarItem>
          );
        }

        const open = doc.some(d => d.slug === pathname);
        return <DocNestedNav key={k} defaultOpen={open} docs={doc} isActive={isActive} />;
      })}
    </>
  );
}
