import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
