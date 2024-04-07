import { Constructable } from '@/types';
import { createFilter } from '@line/filter';
import { Werewolf } from '@werewolf/game';
import { t } from '@werewolf/locales';
import { Character } from '@werewolf/character';
import { Game } from '../../../filters/game';
import { User, UserId } from '../../../filters/user';

export const GetWerewolfGame = Game(Werewolf);

export const IsHost = createFilter(UserId, GetWerewolfGame, (userId, game) => {
  if (userId && game.stage.host === userId) {
    return { userId, game };
  }
});

export const IsPlayer = createFilter(User, GetWerewolfGame, async (user, game) => {
  const character = game.players.get(user.userId);
  if (!character) throw t(`NotJoined`);
  if (character.name === Character.type) throw t(`NotStarted`);
  return { user, game, character };
});

export const IsCharacter = <C extends Character>(CharacterConstructor: Constructable<C>) =>
  createFilter(IsPlayer, async d => {
    if (d.character instanceof CharacterConstructor) {
      return d;
    }
  });
