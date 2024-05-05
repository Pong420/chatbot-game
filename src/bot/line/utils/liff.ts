export function liffUrl(pathname: string) {
  return `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}${pathname}`;
}
