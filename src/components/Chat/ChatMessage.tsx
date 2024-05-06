/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils';

export interface ChatMessageProps {
  sender?: string;
  self?: boolean;
  avatar?: string;
  children?: React.ReactNode;
}

export function ChatMessage({ sender, self, avatar, children }: ChatMessageProps) {
  return (
    <div className={cn(`flex gap-2 text-sm w-10/12`, sender && 'pt-4', self ? 'flex-row-reverse ml-auto mr-0' : '')}>
      {!self && (
        <div
          className={cn(
            'size-10 bg-muted rounded-full self-start flex-shrink-0 overflow-hidden flex items-center justify-center',
            !sender && 'invisible'
          )}
        >
          {avatar ? (
            <img src={avatar} alt="avater" />
          ) : (
            <img src="/favicon-32x32.png" alt="avater" className="size-6" />
          )}
        </div>
      )}
      <div className="mt-1">
        {sender && !self && <div className="text-xs text-muted-foreground">{sender}</div>}
        <div
          className={cn(
            'w-fit px-3 py-2 rounded-lg',
            self ? 'rounded-tr-none bg-foreground text-background' : 'rounded-tl-none bg-muted'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
