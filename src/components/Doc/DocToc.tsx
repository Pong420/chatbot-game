'use client';

import { useState, useEffect, useMemo } from 'react';
import { TableOfContents } from '@/lib/toc';
import { useMounted } from '@/hooks/useMounted';
import { DocTocTree } from './DocTocTree';

interface TocProps {
  toc: TableOfContents;
}

export function DocToc({ toc }: TocProps) {
  const itemIds = useMemo(
    () =>
      toc.items
        ? toc.items
            .flatMap(item => [item.url, item?.items?.map(item => item.url)])
            .flat()
            .filter((s): s is string => !!s)
            .map(id => id?.split('#')[1])
        : [],
    [toc]
  );
  const activeHeading = useActiveItem(itemIds);
  const mounted = useMounted();

  if (!toc?.items || !mounted) {
    return null;
  }

  return (
    <div className="px-6 pb-4 ml-10 min-w-48 border-l-muted border-l whitespace-nowrap">
      <p className="font-medium">目錄</p>
      <DocTocTree tree={toc} activeItem={activeHeading} />
    </div>
  );
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string>(
    typeof window === 'undefined' ? '' : decodeURIComponent(window.location.hash.slice(1))
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds?.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds?.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}
