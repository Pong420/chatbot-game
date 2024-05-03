import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="container flex-1 items-start flex max-w-screen-xl px-4">{children}</main>
      <Footer />
    </div>
  );
}
