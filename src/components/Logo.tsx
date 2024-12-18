import Image, { ImageProps } from 'next/image';
import logo from '@/assets/logo.png';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

export function Logo({
  withTooltip = true,
  size,
  ...props
}: Partial<ImageProps> & { size?: number; withTooltip?: boolean }) {
  const content = (
    <Image
      {...props}
      src={logo}
      width={size}
      height={size ? Math.round((781 / 707) * size) : undefined}
      priority
      alt="Pixel Art - Robot 1 by ProjectRobo1989"
    />
  );

  if (withTooltip) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={250}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent>
            <Link href="https://www.deviantart.com/projectrobo1989/art/Pixel-Art-Robot-1-805987543">
              Credit - ProjectRobo1989 on DeviantArt
            </Link>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}
