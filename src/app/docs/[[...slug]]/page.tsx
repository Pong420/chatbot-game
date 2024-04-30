import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allDocs } from 'contentlayer/generated';
import { format, parseISO } from 'date-fns';
import { absoluteUrl, cn } from '@/lib/utils';
import { Mdx } from '@/components/mdx-components';

interface DocPageProps {
  params: {
    slug: string[];
  };
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug?.join('/') || '';
  const doc = allDocs.find(doc => doc.slugAsParams === slug);

  if (!doc) {
    return null;
  }

  return doc;
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    return {};
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: 'article',
      url: absoluteUrl(doc.slug)
      // TODO:
      // images: [
      //   {
      //     url: siteConfig.ogImage,
      //     width: 1200,
      //     height: 630,
      //     alt: siteConfig.name
      //   }
      // ]
    }
  };
}

export async function generateStaticParams(): Promise<DocPageProps['params'][]> {
  return allDocs.map(doc => ({
    slug: doc.slugAsParams.split('/')
  }));
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    notFound();
  }

  return (
    <main className="max-w-screen-md mx-auto p-6 flex flex-col">
      <div className="space-y-2">
        <h1 className={cn('scroll-m-20 text-4xl font-bold tracking-tight')}>{doc.title}</h1>
        {doc.date && (
          <time dateTime={doc.date} className="mb-1 text-xs text-muted-foreground">
            最後更新時間: {format(parseISO(doc.date), 'LLLL d, yyyy')}
          </time>
        )}
      </div>
      <div className="pb-12 pt-8">
        <Mdx code={doc.body.code} />
      </div>
      {/* TODO: DocsPager*/}
    </main>
  );
}
