import { Card, CardDescription, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Feature({ title = '', description = '', path = '' }) {
  const containerClassName = cn('lg:w-[32%]', 'w-full');

  const content = (
    <Card className={cn('h-full flex flex-col', !title && 'hidden')}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );

  if (path) {
    return (
      <Link
        href={`/docs/${path}`}
        className={cn(containerClassName, 'hover:shadow-lg cursor-pointer')}
        draggable={false}
      >
        {content}
      </Link>
    );
  }

  return <div className={cn(containerClassName, 'opacity-60')}>{content}</div>;
}
