import { DocNavBar } from '@/components/Doc/DocNav';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="container flex-1 items-start flex max-w-screen-xl px-4">
        <DocNavBar />
        {children}
      </main>
      <Footer />
    </div>
  );
}
