import { Logo } from './Logo';

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center w-full h-full fixed left-0">
      <div className="flex flex-col items-center gap-4">
        <Logo className="mr-4" size={64} />
        <div className="font-bold">LOADING...</div>
      </div>
    </div>
  );
}
