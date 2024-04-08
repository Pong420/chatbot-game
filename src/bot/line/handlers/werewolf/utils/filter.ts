import { Constructable } from '@/types';
import { createFilter, Game, UserId } from '@line/filter';
import { Werewolf } from '@werewolf/game';
import { t } from '@werewolf/locales';
import { Character } from '@werewolf/character';

export const GetWerewolfGame = Game(Werewolf);

export const IsHost = createFilter(UserId, GetWerewolfGame, (userId, game) => {
  if (userId && game.stage.host === userId) {
    return { userId, game };
  }
});

export const IsPlayer = createFilter(UserId, GetWerewolfGame, async (userId, game) => {
  const character = game.players.get(userId);
  if (!character) throw t(`NotJoined`);
  if (character.name === Character.type) throw t(`NotStarted`);
  return { userId, game, character };
});

export const IsCharacter = <C extends Character>(CharacterConstructor: Constructable<C>) =>
  createFilter(IsPlayer, async d => {
    if (d.character instanceof CharacterConstructor) {
      return { ...d, character: d.character as C };
    }
  });
