import { getGame } from '@/supabase/game';
import { isGroupEvent, isSingleEvent } from '@line/types';
import { createFilter } from '@line/filter';
import { getUser } from '@line/utils/userService';
import { t } from '@line/locales';

interface GameContructor<G> {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (options: { groupId: string; data?: any }) => G;
}

const GroupId = createFilter(async event => {
  if (isGroupEvent(event)) return event.source.groupId;
  if (isSingleEvent(event)) {
    const user = await getUser(event);
    return user.game;
  }
});

export const Game = <G>(GameContructor: GameContructor<G>) => {
  return createFilter(GroupId, async groupId => {
    const { data } = await getGame(groupId);
    return data?.type === GameContructor.type
      ? GameContructor.create({ groupId: data.groupId, data: data.data })
      : null;
  });
};

export const CanStartGame = createFilter(GroupId, async groupId => {
  const { data } = await getGame(groupId);
  if (data) throw t('OtherGameRuning', data.type);
  return true;
});
