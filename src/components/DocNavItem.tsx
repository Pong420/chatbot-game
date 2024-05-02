import Link from 'next/link';
import { Button, ButtonProps } from './ui/button';
import { cn } from '@/lib/utils';

export interface DocNavItemProps extends ButtonProps {
  href?: string;
  active?: boolean;
  level?: number;
  isActive?: (pathname: string) => boolean;
}

export function DocNavItem({ href, active, isActive, className, level = 0, ...props }: DocNavItemProps) {
  const _active = active || (href && isActive?.(href));
  const button = (
    <Button
      {...props}
      component="div"
      variant={_active ? 'default' : 'ghost'}
      className={cn('w-full justify-between', `pl-${4 + level * 2}`, className)}
    />
  );

  return href ? <Link href={href}>{button}</Link> : button;
}
