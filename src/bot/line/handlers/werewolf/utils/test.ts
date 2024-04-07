import { characters } from '@werewolf/character';
import { Werewolf } from '@werewolf/game';
import { LineUser } from '@line/test';

export const getCharacters = (game: Werewolf, clients: LineUser[]) =>
  Object.entries(characters).reduce(
    (res, [k, CharacterConstructor]) => ({
      ...res,
      [k.toLowerCase() + 's']: clients.filter(c => game.players.get(c.userId) instanceof CharacterConstructor)
    }),
    {} as Record<`${Lowercase<keyof typeof characters>}s`, LineUser[]>
  );
