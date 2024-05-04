import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { PostNav } from '@/components/Post/PostNav';
import { getPostFromParams, PostProps } from '@/lib/post';

export default function Layout({ children, params }: React.PropsWithChildren<PostProps>) {
  const post = getPostFromParams(params);

  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="container flex-1 items-start flex max-w-screen-xl px-4">
        {post && (
          <Sidebar>
            <PostNav />
          </Sidebar>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
