'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

export interface ChatInputProps extends Omit<React.ComponentProps<typeof Input>, 'onSubmit'> {
  loading?: boolean;
  onSubmit?: (text: string) => void;
}

export function ChatInput({ className = '', loading, onSubmit, ...props }: ChatInputProps) {
  const [text, setText] = useState('');

  return (
    <form
      className={cn('w-full fixed left-0 right-0 bottom-2 mx-auto p-4 flex gap-2', className)}
      onSubmit={event => {
        event.preventDefault();
        setText('');
        onSubmit?.(text);
      }}
    >
      <Input
        className="h-12 shadow-sm bg-[hsl(var(--background))] text-md"
        placeholder="輸入..."
        {...props}
        readOnly={loading}
        value={text}
        onChange={event => setText(event.target.value)}
      />
      <Button type="submit" className="block size-12 flex-shrink-0 p-0" disabled={loading}>
        <PaperPlaneIcon className="w-4 h-4 m-auto" />
      </Button>
    </form>
  );
}
