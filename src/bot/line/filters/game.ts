/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebhookEvent } from '@line/bot-sdk';
import { GameConstructor, GameInstance, GameStatus, getGame } from '@service/game/game';
import { isGroupEvent, isSingleEvent } from '@line/types';
import { createFilter, GroupId } from '@line/filter';
import { getUser } from '@line/utils/userService';
import { t } from '@line/locales';

export const Game = <G extends GameInstance>(GameConstructor: GameConstructor<G>) => {
  return async (event: WebhookEvent) => {
    const groupId = isGroupEvent(event)
      ? event.source.groupId
      : isSingleEvent(event)
        ? await getUser(event).then(u => u?.game)
        : null;

    if (!groupId) throw false;

    try {
      const data = await getGame(groupId);
      if (data?.type === GameConstructor.type) {
        return GameConstructor.create(data.data as Record<string, unknown>);
      }
    } catch (error) {}

    throw false;
  };
};

export const CanStartGame = createFilter(GroupId, async groupId => {
  const data = await getGame(groupId);
  // TODO: use game name instead of type
  if (data && data.status !== GameStatus.CLOSE) throw t('OtherGameRuning', data.type);
  return groupId;
});
