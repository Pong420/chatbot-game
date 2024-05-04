import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { DocNav } from '@/components/Doc/DocNav';
import { DocPageProps, getDocFromParams } from '@/lib/doc';

export default function Layout({ children, params }: React.PropsWithChildren<DocPageProps>) {
  const doc = getDocFromParams({ params });

  return (
    <div className="min-h-full flex flex-col">
      <Header siderbarLabel="文檔" sidebar={<DocNav />} />
      <main className="container flex-1 items-start flex max-w-screen-xl px-4">
        <Sidebar hidden={!doc?.navbar}>
          <DocNav />
        </Sidebar>
        {children}
      </main>
      <Footer />
    </div>
  );
}
