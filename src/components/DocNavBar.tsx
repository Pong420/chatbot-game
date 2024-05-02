'use client';

import groupBy from 'lodash-es/groupBy';
import keyBy from 'lodash-es/keyBy';
import { allDocs, allCategories } from 'contentlayer/generated';
import { ChevronRightIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DocNavItem, DocNavItemProps } from './DocNavItem';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ValueOf } from '@/types';

const category = keyBy(allCategories, '_raw.sourceFileDir');

const groupByDirectory = groupBy(
  allDocs.filter(d => d.navbar).map(d => ({ ...d, category: category[d._raw.sourceFileDir] })),
  d => (d._raw.sourceFileDir === '.' ? d._raw.flattenedPath : d._raw.sourceFileDir)
);

const entries = Object.entries(groupByDirectory).map(
  ([k, v]) => [k, v.sort((a, b) => a.navbarPosition - b.navbarPosition)] as const
);

function Nested({
  docs,
  defaultOpen,
  isActive
}: {
  docs: ValueOf<typeof groupByDirectory>;
  defaultOpen: boolean;
  isActive?: DocNavItemProps['isActive'];
}) {
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

export function DocNavBar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100%-3.5rem)] md:sticky md:block w-48">
      <ScrollArea className="relative overflow-hidden h-full py-6 pr-6 lg:py-8">
        {entries.map(([k, doc]) => {
          const isActive = (href: string) => href === pathname;

          if (doc.length === 1) {
            return (
              <DocNavItem key={k} href={doc[0].slug} isActive={isActive}>
                {doc[0].title}
              </DocNavItem>
            );
          }

          const open = doc.some(d => d.slug === pathname);

          return <Nested key={k} defaultOpen={open} docs={doc} isActive={isActive} />;
        })}
      </ScrollArea>
    </aside>
  );
}
