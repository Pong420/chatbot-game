// import { DocNavBar } from '@/components/Doc/DocNav';
import { DocNav } from '@/components/Doc/DocNav';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar/Sidebar';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="container flex-1 items-start flex max-w-screen-xl px-4">
        <Sidebar>
          <DocNav />
        </Sidebar>
        {children}
      </main>
      <Footer />
    </div>
  );
}
