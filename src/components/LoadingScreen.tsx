import { Logo } from './Logo';

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center w-full h-full fixed">
      <div className="flex flex-col items-center gap-4">
        <Logo className="w-16 mr-4" />
        <div className="font-bold">LOADING...</div>
      </div>
    </div>
  );
}
