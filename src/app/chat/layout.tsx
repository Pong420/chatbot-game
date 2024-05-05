import { Viewport } from 'next';

export const viewport: Viewport = {
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content'
};

export default async function Layout({ children }: React.PropsWithChildren) {
  return <div className="container max-w-xl px-0 pb-24">{children}</div>;
}
