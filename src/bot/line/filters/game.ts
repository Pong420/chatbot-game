/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebhookEvent } from '@line/bot-sdk';
import { GameConstructor, GameInstance, GameStatus, getGame, updateGame } from '@service/game';
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
        const game = GameConstructor.create(data);
        return { game, data };
      }
    } catch (error) {}

    throw false;
  };
};

/**
 * @deprecated
 */
export const CanStartGame = ({ timeout = 5 * 60 * 1000 } = {}) =>
  createFilter(GroupId, async groupId => {
    if (groupId === process.env.LINE_DEBUG_GROUP_ID) throw false;
    const data = await getGame(groupId, { status: GameStatus.OPEN });
    if (data) {
      const diff = +new Date() - +new Date(data.updated_at);
      if (diff < timeout) {
        throw t('OtherGameRuning', (data.data as any).name);
      } else {
        await updateGame(data.id, { status: GameStatus.CLOSE });
      }
    }
    return groupId;
  });
