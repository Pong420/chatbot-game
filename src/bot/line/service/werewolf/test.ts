import { nanoid } from 'nanoid';
import { createExpectEvent, LineUser, createLineEventTestSuite } from '@line/test';
import { characters } from '@werewolf/character';
import { Werewolf } from '@werewolf/game';
import { werewolfGameHandlers } from './handler';

export const getPlayersByCharacter = <C extends LineUser>(game: Werewolf, clients: C[]) =>
  Object.entries(characters).reduce(
    (res, [k, CharacterConstructor]) => ({
      ...res,
      [k.toLowerCase() + 's']: clients.filter(c => game.players.get(c.userId) instanceof CharacterConstructor)
    }),
    {} as Record<`${Lowercase<keyof typeof characters>}s`, C[]>
  );

export const expectEvent = createExpectEvent(werewolfGameHandlers);

export const { createLineUser } = createLineEventTestSuite(werewolfGameHandlers);

export const groupId = nanoid();
export const players = Array.from({ length: 12 }, () => createLineUser({ groupId }));
export type WerewolfPlayer = (typeof players)[number];
