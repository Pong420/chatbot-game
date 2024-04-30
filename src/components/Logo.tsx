import Image, { ImageProps } from 'next/image';
import logo from '@/assets/logo.png';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

export function Logo(props: Partial<ImageProps>) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={400}>
        <TooltipTrigger asChild>
          <Image {...props} src={logo} alt="Pixel Art - Robot 1 by ProjectRobo1989" />
        </TooltipTrigger>
        <TooltipContent>
          <Link href="https://www.deviantart.com/projectrobo1989/art/Pixel-Art-Robot-1-805987543">
            @Credit ProjectRobo1989 on DeviantArt
          </Link>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
// https://www.deviantart.com/projectrobo1989/art/Pixel-Art-Robot-1-805987543
