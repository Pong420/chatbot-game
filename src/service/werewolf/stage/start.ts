import { instanceToPlain, plainToInstance } from 'class-transformer';
import { randomOption, randomPick } from '@/utils/random';
import { Character, Werewolf, Predictor, Witcher, Hunter, Guard, Villager } from '../character';
import { t } from '../locales';
import { Stage } from './_stage';
import { Night } from './night';
import { Guard as GuardStage } from './guard';
import type { Init } from './init';

/**
 * For extends configuration from Init
 */
export interface Start extends Omit<Init, 'name'> {}

export class Start extends Stage {
  readonly name = 'Start';

  get maxPlayers() {
    return this.numOfPlayers === 'flexible' ? 12 : this.numOfPlayers;
  }

  join(payload: Pick<Character, 'id' | 'nickname'>) {
    if (this.players.has(payload.id)) throw t('Joined', payload.nickname);
    if (this.players.size >= this.maxPlayers) throw t('GameIsFull', payload.nickname);

    for (const player of this.players.values()) {
      if (payload.nickname === player.nickname) throw t(`NicknameUsed`, payload.nickname);
    }

    const player = plainToInstance(Character, payload);
    this.players.set(player.id, player);
    this.playersByName[player.nickname] = player;
  }

  getCharacters(numOfPlayers: number) {
    const characters = Array.from({ length: Math.floor(numOfPlayers / 3) }, () => Werewolf) as (typeof Character)[];

    if (numOfPlayers >= 6) {
      characters.push(Predictor);
    }

    if (numOfPlayers >= 11) {
      characters.push(Witcher, Hunter, Guard);
    } else if (numOfPlayers >= 9) {
      characters.push(Witcher, Hunter);
    } else if (numOfPlayers >= 6) {
      characters.push(randomOption([Guard, Hunter]));
    }

    while (characters.length < numOfPlayers) {
      characters.push(Villager);
    }

    return characters;
  }

  next(): typeof Stage {
    return GuardStage.available(this) ? GuardStage : Night;
  }

  onEnd(): void {
    const minPlayers = this.numOfPlayers === 'flexible' ? 6 : this.numOfPlayers;

    if (this.players.size < minPlayers) {
      throw t('NoEnoughPlayers', minPlayers);
    }

    const characters = this.numOfPlayers === 'flexible' ? this.getCharacters(this.players.size) : this.characters;
    this.characters = [...characters];

    this.players = new Map(
      Array.from(this.players, ([id, v]) => {
        const CharacterConstructor = randomPick(characters);
        const data = instanceToPlain(v);
        const player = plainToInstance(CharacterConstructor, data);
        return [id, player];
      })
    );

    super.onEnd();
  }
}
