'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DocNav } from './DocNav';

export function DocMobileNav({ className = '' }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden',
            className
          )}
        >
          <HamburgerMenuIcon width="1em" height="1em" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="px-2">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)]">
          <DocNav />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
