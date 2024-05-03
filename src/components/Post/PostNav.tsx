'use client';

import { usePathname } from 'next/navigation';
import { Post } from 'contentlayer/generated';
import { ChevronRightIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarItem, SidebarItemProps } from '@/components/Sidebar/SidebarItem';
import { useState } from 'react';
import { groupByYearPosts } from '../constants';

export interface PostNestedNavProps {
  posts: Post[];
  label: string;
  defaultOpen: boolean;
  isActive?: SidebarItemProps['isActive'];
}

function PostNestedNav({ label, posts, defaultOpen, isActive }: PostNestedNavProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible defaultOpen={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full">
        <SidebarItem>
          {label}
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </SidebarItem>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {posts.map(p => (
          <SidebarItem key={p._id} level={2} href={p.slug} isActive={isActive}>
            <div className=" text-ellipsis overflow-hidden">{p.title}</div>
          </SidebarItem>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function PostNav() {
  const pathname = usePathname();
  const isActive = (href: string) => href === pathname;

  return (
    <>
      {groupByYearPosts.map(([year, posts]) => {
        return <PostNestedNav key={year} label={year} posts={posts} defaultOpen isActive={isActive} />;
      })}
    </>
  );
}
