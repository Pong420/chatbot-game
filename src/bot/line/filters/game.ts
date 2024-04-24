/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebhookEvent } from '@line/bot-sdk';
import { getGame } from '@/supabase/game';
import { GameConstructor, GameInstance } from '@/types';
import { isGroupEvent, isSingleEvent } from '@line/types';
import { createFilter, GroupId } from '@line/filter';
import { getUser } from '@line/utils/userService';
import { t } from '@line/locales';

export const Game = <G extends GameInstance>(GameConstructor: GameConstructor<G>) => {
  return async (event: WebhookEvent) => {
    const groupId = isGroupEvent(event)
      ? event.source.groupId
      : isSingleEvent(event)
        ? await getUser(event).then(u => u.game)
        : null;

    if (!groupId) throw false;

    try {
      const data = await getGame(groupId);
      if (data?.type === GameConstructor.type) {
        return GameConstructor.create({ groupId: data.groupId, data: data.data });
      }
    } catch (error) {}

    throw false;
  };
};

export const CanStartGame = createFilter(GroupId, async groupId => {
  const data = await getGame(groupId);
  if (data) throw t('OtherGameRuning', data.type);
  return groupId;
});
