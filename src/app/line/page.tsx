import { permanentRedirect, RedirectType } from 'next/navigation';
import LineLogo from '@/assets/LINE_logo.svg';

export interface PageProps {
  params: { slug: string };
  searchParams: { 'liff.state'?: string };
}

export const metadata = {
  title: 'Line'
};

export default function Page({ searchParams }: PageProps) {
  const query = searchParams['liff.state'];

  if (query) {
    return permanentRedirect(query, RedirectType.replace);
  }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <LineLogo className="block m-auto" width="100px" />
      <div className="mt-2 text-lg">請使用LINE APP開啟</div>
    </div>
  );
}
