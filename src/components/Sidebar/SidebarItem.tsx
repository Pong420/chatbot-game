import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

export interface SidebarItemProps extends ButtonProps {
  href?: string;
  active?: boolean;
  level?: number;
  isActive?: (pathname: string) => boolean;
}

export function SidebarItem({ href, active, isActive, className, level = 0, ...props }: SidebarItemProps) {
  const _active = active || (href && isActive?.(href));
  const button = (
    <Button
      {...props}
      component="div"
      variant={_active ? 'default' : 'ghost'}
      className={cn('w-full justify-between', `px-${4 + level * 2}`, className)}
    />
  );

  return href ? <Link href={href}>{button}</Link> : button;
}
