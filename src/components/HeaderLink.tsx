'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function HeaderLink({ href, children }: React.PropsWithChildren<{ href: string }>) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn(
        'transition-colors hover:text-foreground/80',
        pathname?.startsWith(href) ? 'text-foreground' : 'text-foreground/60'
      )}
    >
      {children}
    </Link>
  );
}
