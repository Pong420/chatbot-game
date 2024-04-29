export default function Layout({ children }: React.PropsWithChildren) {
  return <div className="container flex items-center justify-center min-h-full">{children}</div>;
}
