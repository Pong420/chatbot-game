import { Viewport } from 'next';
import { getChat, getMessages } from '@service/chat';
import { Chat } from '@/components/Chat/Chat';
import { sendMessage } from '@service/actions/werewolf';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    chat: string;
  };
}

export const viewport: Viewport = {
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content'
};

export const revalidate = 5; // revalidate at most every 5 min

export default async function Page({ params }: PageProps) {
  const { data: chat } = await getChat({ chat: params.chat });
  if (!chat) return notFound();
  const { data } = await getMessages({ chat: chat.id });
  const handleSubmit = sendMessage.bind(null, chat.id);
  return <Chat chat={chat.id} initialMessages={data || []} onSubmit={handleSubmit} />;
}
