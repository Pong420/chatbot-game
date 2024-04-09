/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebhookEvent } from '@line/bot-sdk';
import { getGame } from '@/supabase/game';
import { isGroupEvent, isSingleEvent } from '@line/types';
import { createFilter, GroupId } from '@line/filter';
import { getUser } from '@line/utils/userService';
import { t } from '@line/locales';

interface GameConstructor<G> {
  type: string;
  create: (options: { groupId: string; data?: any }) => G;
  new (...args: any[]): G;
}

export const Game = <G>(GameConstructor: GameConstructor<G>) => {
  return async (event: WebhookEvent) => {
    const groupId = isGroupEvent(event)
      ? event.source.groupId
      : isSingleEvent(event)
        ? await getUser(event).then(u => u.game)
        : null;

    if (!groupId) throw false;

    const { data } = await getGame(groupId);
    return data?.type === GameConstructor.type
      ? GameConstructor.create({ groupId: data.groupId, data: data.data })
      : null;
  };
};

export const CanStartGame = createFilter(GroupId, async groupId => {
  const { data } = await getGame(groupId);
  if (data) throw t('OtherGameRuning', data.type);
  return groupId;
});
