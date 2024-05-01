import Link from 'next/link';

function Item({ href = '', children = '' }) {
  return (
    <li>
      <Link href={href}>{children}</Link>
    </li>
  );
}

function Separator() {
  return <div style={{ borderLeft: '1px solid', height: `0.8em` }}></div>;
}

export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <ul className="flex items-center gap-3 text-muted-foreground text-sm mx-auto">
          <Item href="/privacy">隱私政策</Item>
          <Separator />
          <Item href="/term-of-use">使用條款</Item>
        </ul>
      </div>
    </footer>
  );
}
