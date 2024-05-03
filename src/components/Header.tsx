import Link from 'next/link';
import { DocMobileNav } from '@/components/Doc/DocMobileNav';
import { Logo } from './Logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-xl items-center px-2 md:px-4">
        <DocMobileNav className="w-8 h-8 mr-2" />
        <Link href="/" className="flex items-center gap-4">
          <Logo width={30} withTooltip={false} />
          <div className="font-bold">遊戲機器人</div>
        </Link>
      </div>
    </header>
  );
}
