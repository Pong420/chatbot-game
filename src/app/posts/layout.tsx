import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { PostNav } from '@/components/Post/PostNav';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="container flex-1 items-start flex max-w-screen-xl px-4">
        <Sidebar>
          <PostNav />
        </Sidebar>
        {children}
      </main>
      <Footer />
    </div>
  );
}
