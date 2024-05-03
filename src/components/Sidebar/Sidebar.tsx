import { ScrollArea } from '@/components/ui/scroll-area';

export function Sidebar({ children }: React.PropsWithChildren) {
  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100%-3.5rem)] md:sticky md:block">
      <ScrollArea className="relative overflow-hidden h-full w-full py-6 lg:py-8">
        <div className="w-52 pr-6">{children}</div>
      </ScrollArea>
    </aside>
  );
}
