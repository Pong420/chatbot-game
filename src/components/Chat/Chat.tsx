'use client';

import { useState, useEffect, useTransition } from 'react';
import { toast } from 'sonner';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Message } from '@service/chat';
import { sendMessage, SendMessage } from '@service/actions/werewolf';
import { supabase } from '@service/supabase.borwser';
import { Profile, getProfile } from '@line/next';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';

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
  /**
   * 365 for ios virtual keybord is opened
   */
  window.scrollTo(0, document.documentElement.scrollHeight - 365);
};

export function Chat({ chat, initialMessages, onSubmit }: ChatProps) {
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [messages, setMessages] = useState(initialMessages);
  const [profile, setProfile] = useState<Profile>();
  const [sendingMessage, startSendMessage] = useTransition();

  const handleSubmit = (text: string) => {
    text = text.trim();
    if (!text || !profile) return;
    startSendMessage(async () => {
      const { userId, pictureUrl } = profile;
      const { data, error } = await onSubmit?.({ text, userId, avatar: pictureUrl });
      data && channel?.send({ type: 'broadcast', event: 'message', payload: data });
      error && toast.error(error);
    });
  };

  useEffect(() => {
    let connected: boolean | undefined;
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
      .subscribe(status => {
        if (status === 'SUBSCRIBED') {
          connected === false && toast.success('已連線');
          connected = true;
        }

        if (status === 'CLOSED' && connected) {
          connected = false;
          toast.error('斷線了，請稍候或者嘗試重新打開');
        }
      });

    getProfile()
      .then(setProfile)
      .catch(() => toast.error('登入失敗'));

    setChannel(channel);
    return () => {
      channel.unsubscribe();
    };
  }, [chat]);

  useEffect(() => scrollToBottom(), [messages, profile]);

  if (!profile) return <LoadingScreen />;

  return (
    <>
      <Alert className="bg-amber-400 border-none shadow-md select-none">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>注意</AlertTitle>
        <AlertDescription>對話沒有經過沒有加密而且半公開，請勿在這裡發送重要的訊息。</AlertDescription>
      </Alert>
      <div className="space-y-0 select-none">
        {messages.map((m, i) => (
          <ChatMessage
            key={m.id}
            sender={m.sender === messages[i - 1]?.sender ? undefined : m.sender}
            self={m.sender === profile.userId}
          >
            {m.text}
          </ChatMessage>
        ))}
      </div>
      <ChatInput className="max-w-xl" loading={sendingMessage} onSubmit={handleSubmit} />
    </>
  );
}
