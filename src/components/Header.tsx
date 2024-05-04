import Link from 'next/link';
import { HeaderLink } from './HeaderLink';
import { Logo } from './Logo';
import { SidebarMobile } from './Sidebar/SidebarMobile';
import { Button } from './ui/button';
import { ArrowRightIcon } from '@radix-ui/react-icons';

export interface HeaderProps {
  siderbarLabel?: string;
  sidebar?: React.ReactNode;
}

const navs = [
  { path: '/docs', label: '資料' },
  { path: '/posts', label: '貼文' }
];

export function Header({ siderbarLabel, sidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-xl items-center px-2 md:px-4">
        <SidebarMobile label={siderbarLabel}>
          {sidebar || (
            <div className="space-y-2">
              {navs.map(n => {
                return (
                  <Link key={n.path} href={n.path} className="block">
                    <Button className="w-full justify-between" variant="ghost">
                      {n.label}
                      <ArrowRightIcon />
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </SidebarMobile>

        <Link href="/" className="flex items-center gap-2 mr-6">
          <Logo width={30} withTooltip={false} />
          <div className="font-bold">遊戲機器人</div>
        </Link>

        <nav className="items-center gap-4 text-sm lg:gap-6 hidden md:flex">
          {navs.map(n => (
            <HeaderLink key={n.path} href={n.path}>
              {n.label}
            </HeaderLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
