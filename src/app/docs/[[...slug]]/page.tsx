/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next';
import { allDocs } from 'contentlayer/generated';
import { format, parseISO } from 'date-fns';
import { absoluteUrl, cn } from '@/lib/utils';
import { getTableOfContents } from '@/lib/toc';
import { DocPageProps, getDocFromParams } from '@/lib/doc';
import { translate, translateRegex } from '@/utils/locale';
import { Mdx } from '@/components/mdx-components';
import { DocToc } from '@/components/Doc/DocToc';
import '@/app/mdx.css';

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const doc = getDocFromParams({ params });

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

function getLocale(type: string) {
  switch (type) {
    case 'line':
      return import('@line/locales');
    case 'werewolf':
      return import('@werewolf/locales');
  }
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = getDocFromParams({ params });

  if (!doc) {
    return null;
  }

  const toc = await getTableOfContents(doc.body.raw);

  const messages = await Promise.all(doc.messages?.split(',').map(getLocale) || []).then(modules =>
    modules.reduce((r, m) => (m ? { ...r, ...m?.messages } : r), {} as Record<string, string | string[]>)
  );

  const globals = {
    ...messages,
    t: (k: string, ...args: any[]) => translate(messages, k, ...args),
    tRegex: translateRegex
  };

  return (
    <>
      <article className="flex-1">
        <div className="py-6 pr-6 lg:py-8">
          <div className="text-sm text-muted-foreground mb-2">{doc.category?.label}</div>
          <h1 className={cn('scroll-m-20 text-4xl font-bold tracking-tight')}>{doc.title}</h1>
          {doc.date && (
            <time dateTime={doc.date} className="mb-1 text-xs text-muted-foreground">
              最後更新時間: {format(parseISO(doc.date), 'LLLL d, yyyy')}
            </time>
          )}
        </div>
        <div className="pb-12 pt-0">
          <Mdx code={doc.body.code} globals={globals} />
        </div>
      </article>
      {doc.toc && (
        <div className="hidden text-sm lg:block">
          <div className="fixed top-14 py-10">
            <DocToc toc={toc} />
          </div>
        </div>
      )}
    </>
  );
}
