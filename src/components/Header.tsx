import Link from 'next/link';
import { DocMobileNav } from './Doc/DocMobileNav';
import { HeaderLink } from './HeaderLink';
import { Logo } from './Logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-xl items-center px-2 md:px-4">
        <DocMobileNav className="w-8 h-8 mr-2" />

        <Link href="/" className="flex items-center gap-4 mr-6">
          <Logo width={30} withTooltip={false} />
          <div className="font-bold">遊戲機器人</div>
        </Link>

        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <HeaderLink href="/docs">資料</HeaderLink>
          <HeaderLink href="/posts">貼文</HeaderLink>
        </nav>
      </div>
    </header>
  );
}
