import { WebhookEvent } from '@line/bot-sdk';
import { Constructable } from '@/types';
import { createFilter, Game, TextMatch, UserId } from '@line/filter';
import { isSingleEvent } from '@line/types';
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

export const IsCharacter = createWerewolfFilter(Character);

export function createWerewolfFilter<C extends Character>(CharacterConstructor: Constructable<C>) {
  type R = {
    userId: string;
    game: Werewolf;
    target?: Character;
    character: C;
  };
  type RR<T> = (event: WebhookEvent) => Promise<Promise<T>>;

  interface Options {
    target?: RegExp | string;
    yourAreNotError?: boolean;
  }

  function filter(): RR<R>;
  function filter(options: Options & { target: RegExp | string }): RR<R & { target: Character }>;
  function filter(options: Options): RR<R>;
  function filter(options: Options = {}): RR<R> {
    const { target, yourAreNotError } = options;

    return createFilter(
      target ? TextMatch(target) : () => [] as string[],
      IsPlayer,
      (event: WebhookEvent) => event,
      async ([, name], d, event) => {
        if (d.character instanceof CharacterConstructor) {
          const target = name ? d.game.stage.playersByName[name] : undefined;
          if (!target && options?.target) throw t(`TargetNoExists`, name);
          return { ...d, target, character: d.character as C };
        }

        if (isSingleEvent(event) && yourAreNotError) throw t(`YouAreNot`);

        throw false;
      }
    );
  }

  return filter;
}
