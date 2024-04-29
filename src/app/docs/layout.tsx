import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="container flex items-center justify-center min-h-full">
      <div className="text-center flex flex-col gap-4">
        <Image src={logo} alt="logo" width={100} className="block m-auto" />
        <div className="text-lg text-foreground">文檔正在準備中...</div>
        <Link href="/" passHref>
          <Button className="w-40">返回</Button>
        </Link>
        {children}
      </div>
    </div>
  );
}
