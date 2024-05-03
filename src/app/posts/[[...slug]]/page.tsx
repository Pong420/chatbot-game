import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { allPosts } from 'contentlayer/generated';
import { Mdx } from '@/components/mdx-components';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { PostNav } from '@/components/Post/PostNav';
import { cn } from '@/lib/utils';

interface PostProps {
  params: {
    slug?: string[];
  };
}

async function getPostFromParams(params: PostProps['params']) {
  const slug = params?.slug?.join('/');
  const post = allPosts.find(post => post.slugAsParams === slug);

  if (!post) {
    null;
  }

  return post;
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description
  };
}

export async function generateStaticParams(): Promise<PostProps['params'][]> {
  return allPosts.map(post => ({
    slug: post.slugAsParams.split('/')
  }));
}

export default async function PostPage({ params }: PostProps) {
  if (!params.slug) {
    return (
      <div className="flex-1 py-4 md:py-8 space-y-10">
        {allPosts
          .slice()
          .reverse()
          .map(post => (
            <article key={post._id}>
              <Link href={post.slug} className="space-y-1 group">
                <h1 className={cn('scroll-m-20 text-xl font-bold tracking-tight', 'group-hover:underline')}>
                  {post.title}
                </h1>
                <time dateTime={post.date} className="text-xs font-light text-muted-foreground">
                  更新時間: {format(parseISO(post.date), 'LLLL d, yyyy')}
                </time>
                <p className="text-sm font-light text-muted-foreground">{post.description}</p>
              </Link>
            </article>
          ))}
      </div>
    );
  }

  const post = await getPostFromParams(params);
  if (!post) return notFound();

  return (
    <>
      <Sidebar>
        <PostNav />
      </Sidebar>
      <article className="flex-1">
        <div className="py-6 pr-6 lg:py-8">
          <h1 className={cn('scroll-m-20 text-4xl font-bold tracking-tight')}>{post.title}</h1>
          <time dateTime={post.date} className="mb-1 text-xs font-light text-muted-foreground">
            更新時間: {format(parseISO(post.date), 'LLLL d, yyyy')}
          </time>
        </div>
        <div className="pb-12 pt-0">
          <Mdx code={post.body.code} />
        </div>
      </article>
    </>
  );
}
