'use client';

import { useState, useEffect, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChatInput } from './ChatInput';
import { LoadingScreen } from '../LoadingScreen';
import { Message } from '@service/chat';
import { ChatMessage } from './ChatMessage';

export interface SubmitPayload {
  text: string;
  sender: string;
}

export interface ChatProps {
  userId?: string;
  initialMessages: Message[];
  onSubmit: (payload: SubmitPayload) => Promise<{ message: string } | undefined>;
}

const scrollToBottom = () => {
  window.scrollTo(0, document.documentElement.scrollHeight);
};

export function Chat({ userId, initialMessages, onSubmit }: ChatProps) {
  // const [userId, setUserId] = useState<string>();
  const [messages, setMessages] = useState(initialMessages);
  const [sendingMessage, startSendMessage] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = (text: string) => {
    // if (!profile) return;
    if (!userId) return;
    startSendMessage(async () => {
      await onSubmit({ text, sender: userId });
    });
  };

  useEffect(() => {
    if (userId) return;
    async function init() {
      // const { liff } = await import('@line/liff');
      // const liffId = process.env.NEXT_PUBLIC_LIFF_ID || '';
      // await liff.init({ liffId });
      // const profile = await liff.getProfile();
      const profile = { userId: 'testing' };
      router.push(`${pathname}/${profile.userId}`);
    }
    init().catch(console.log);
  }, [userId, router, pathname]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  if (!userId) {
    return <LoadingScreen />;
  }

  return (
    <>
      {messages.map(m => (
        <ChatMessage key={m.id} sender={m.sender}>
          {m.text}
        </ChatMessage>
      ))}
      <ChatInput className="max-w-xl" loading={sendingMessage} onSubmit={handleSubmit} />
    </>
  );
}
