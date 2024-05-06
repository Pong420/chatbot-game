import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content'
};

export const metadata: Metadata = {
  title: '聊天室',
  robots: 'noindex,nofollow'
};

export default async function Layout({ children }: React.PropsWithChildren) {
  return <div className="container max-w-xl px-4 pt-4 pb-24">{children}</div>;
}
