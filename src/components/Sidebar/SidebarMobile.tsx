'use client';

import { useState } from 'react';
import { ArrowLeftIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';

export interface SidebarMobileProps {
  label?: string;
  children?: React.ReactNode;
}

export function SidebarMobile({ label, children }: SidebarMobileProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={
            'px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden w-8 h-8 mr-2'
          }
        >
          <HamburgerMenuIcon width="1em" height="1em" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="px-2">
        {label && (
          <Link href="/">
            <h1 className="absolute left-4 top-3 text font-medium flex items-center gap-2">
              <ArrowLeftIcon />
              {label}
            </h1>
          </Link>
        )}
        <ScrollArea className="mt-8 h-[calc(100vh-8rem)]">{children}</ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
