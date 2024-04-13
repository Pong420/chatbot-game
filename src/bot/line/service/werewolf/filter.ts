import { Constructable } from '@/types';
import { createFilter, Game, UserId } from '@line/filter';
import { Werewolf } from '@werewolf/game';
import { Character } from '@werewolf/character';
import { t } from '@werewolf/locales';

export const WerewolfGame = Game(Werewolf);

export const IsHost = createFilter(UserId, WerewolfGame, (userId, game) => {
  if (game.stage.host !== userId) throw false;
  return { userId, game };
});

export const IsPlayer = createFilter(UserId, WerewolfGame, async (userId, game) => {
  const character = game.players.get(userId);
  if (!character) throw t(`NotJoined`);
  if (character.constructor === Character) throw t(`NotStarted`);
  return { userId, game, character };
});

export const IsCharacter = <C extends Character>(CharacterConstructor: Constructable<C>) =>
  createFilter(IsPlayer, async d => {
    if (d.character instanceof CharacterConstructor) {
      return { ...d, character: d.character as C };
    }
    // TODO:
    // messages for 不，你不是
  });
