import { ScrollArea } from '@/components/ui/scroll-area';
import { DocNav } from './DocNav';

export function DocNavBar() {
  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100%-3.5rem)] md:sticky md:block w-48">
      <ScrollArea className="relative overflow-hidden h-full py-6 pr-6 lg:py-8">
        <DocNav />
      </ScrollArea>
    </aside>
  );
}
