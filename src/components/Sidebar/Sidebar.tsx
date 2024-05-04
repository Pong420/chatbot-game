import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function Sidebar({
  className,
  hidden = false,
  children
}: React.PropsWithChildren<{ className?: string; hidden?: boolean }>) {
  return (
    <aside
      className={cn(
        'fixed top-14 z-30 h-[calc(100%-3.5rem)] hidden md:sticky',
        hidden ? 'md:invisible 2xl:block' : 'md:block',
        className
      )}
    >
      <ScrollArea className="relative overflow-hidden h-full w-full py-6 lg:py-8">
        <div className="w-52 pr-6">{children}</div>
      </ScrollArea>
    </aside>
  );
}
