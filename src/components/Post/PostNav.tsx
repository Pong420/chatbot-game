'use client';

import { usePathname } from 'next/navigation';
import { allPosts, Post } from 'contentlayer/generated';
import { SidebarItem, SidebarItemProps } from '@/components/Sidebar/SidebarItem';

export interface PostNestedNavProps {
  posts: Post[];
  label: string;
  defaultOpen: boolean;
  isActive?: SidebarItemProps['isActive'];
}

export function PostNav() {
  const pathname = usePathname();
  const isActive = (href: string) => href === pathname;

  return (
    <>
      {allPosts.map(p => (
        <SidebarItem key={p._id} level={2} href={p.slug} isActive={isActive}>
          <div className=" text-ellipsis overflow-hidden">{p.title}</div>
        </SidebarItem>
      ))}
    </>
  );
}
