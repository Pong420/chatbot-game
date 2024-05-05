'use client';

import { useState, useEffect, useTransition } from 'react';
import { Message } from '@service/chat';
import { sendMessage, SendMessage } from '@service/actions/werewolf';
import { supabase } from '@service/supabase.borwser';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface SubmitPayload {
  text: string;
  userId: string;
}

export interface ChatProps {
  chat: string;
  initialMessages: Message[];
  onSubmit: (payload: SendMessage) => ReturnType<typeof sendMessage>;
}

const scrollToBottom = () => {
  window.scrollTo(0, document.documentElement.scrollHeight);
};

export function Chat({ chat, initialMessages, onSubmit }: ChatProps) {
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [messages, setMessages] = useState(initialMessages);
  const [sendingMessage, startSendMessage] = useTransition();
  const [getUserId] = useState(async () => {
    try {
      const { liff } = await import('@line/liff');
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID || '';
      await liff.init({ liffId });
      const { userId } = await liff.getProfile();
      return userId;
    } catch (error) {
      return 'Anonymous';
    }
  });

  const handleSubmit = (text: string) => {
    text = text.trim();
    if (!text) return;
    startSendMessage(async () => {
      const userId = await getUserId;
      const { data } = await onSubmit?.({ text, userId });
      data && channel?.send({ type: 'broadcast', event: 'message', payload: data });
    });
  };

  useEffect(() => {
    const channel = supabase
      .channel(chat, {
        config: {
          broadcast: { self: true }
        }
      })
      .on('broadcast', { event: 'message' }, resp => {
        if (resp.type === 'broadcast' && resp.event === 'message') {
          setMessages(messages => [...messages, resp['payload']]);
        }
      })
      .subscribe();
    setChannel(channel);
    return () => {
      channel.unsubscribe();
    };
  }, [chat]);

  useEffect(() => scrollToBottom(), [messages]);

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
