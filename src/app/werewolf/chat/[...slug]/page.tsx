import { Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Chat } from '@/components/Chat/Chat';
import { isWerewolfGame, sendMessage } from '@service/actions/werewolf';
import { Werewolf } from '@werewolf/character';
import { Message, getMessages } from '@service/chat';

interface PageProps {
  params: {
    slug: string[];
  };
}

export const viewport: Viewport = {
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content'
};

export default async function Page({ params }: PageProps) {
  const [gameId, groupId, userId] = params.slug;
  if (!gameId || !groupId) return notFound();

  const id = Number(gameId);
  // const game = await isWerewolfGame(id);

  let messages: Message[] = [];

  if (userId) {
    // const player = game?.getPlayer(userId);
    // if (!(player && player instanceof Werewolf)) return notFound();
    const resp = await getMessages({ chat: `${gameId}_${groupId}` });
    messages = resp.data || messages;
  }

  const handleSendMessage = sendMessage.bind(null, id, groupId);

  return (
    <div className="container max-w-xl px-0 pb-24">
      <Chat userId={userId} initialMessages={messages} onSubmit={handleSendMessage} />
    </div>
  );
}
