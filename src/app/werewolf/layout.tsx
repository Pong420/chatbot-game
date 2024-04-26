import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '狼人殺'
};

export default function Layout({ children }: React.PropsWithChildren) {
  
  return children;
}
