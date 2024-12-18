import { instanceToPlain, plainToInstance } from 'class-transformer';
import { randomOption, randomPick } from '@/utils/random';
import { Character, Werewolf, Predictor, Witcher, Hunter, Guard, Villager } from '../character';
import { t } from '../locales';
import { Stage } from './_stage';
import type { Init } from './init';

/**
 * For extends configuration from Init
 */
export interface Start extends Omit<Init, 'name'> {}

export class Start extends Stage {
  readonly name = 'Start';

  get maxPlayers() {
    return this.numOfPlayers === -1 ? 12 : this.numOfPlayers;
  }

  get minPlayers() {
    return this.numOfPlayers === -1 ? 6 : this.numOfPlayers;
  }

  join(payload: Pick<Character, 'id' | 'nickname'>) {
    if (this.players.has(payload.id)) throw t('Joined', payload.nickname);
    if (this.players.size >= this.maxPlayers) throw t('GameIsFull');

    for (const player of this.players.values()) {
      if (payload.nickname === player.nickname) throw t(`NicknameUsed`, payload.nickname);
    }

    const player = plainToInstance(Character, payload);
    this.players.set(player.id, player);
    this.playersByName[player.nickname] = player;
  }

  getCharacters() {
    if (this.numOfPlayers === -1) {
      const n = this.players.size;
      const characters = Array.from({ length: Math.floor(n / 3) }, () => Werewolf) as (typeof Character)[];

      if (n >= 6) {
        characters.push(Predictor);
      }

      if (n >= 11) {
        characters.push(Witcher, Hunter, Guard);
      } else if (n >= 9) {
        characters.push(Witcher, Hunter);
      } else if (n >= 6) {
        characters.push(randomOption([Guard, Hunter]));
      }

      while (characters.length < n) {
        characters.push(Villager);
      }

      return characters;
    }

    return this.characters;
  }

  onEnd(): void {
    if (this.players.size < this.minPlayers) {
      throw t('NoEnoughPlayers', this.minPlayers);
    }

    const characters = this.getCharacters();
    this.numOfPlayers = this.characters.length;
    this.characters = [...characters];

    this.players = new Map(
      Array.from(this.players, ([id, v]) => {
        const CharacterConstructor = randomPick(characters);
        const data = instanceToPlain(v);
        const player = plainToInstance(CharacterConstructor, data);
        if (player instanceof Werewolf && this.game.werewolvesKnowEachOthers) {
          player.knowEachOthers = true;
        }
        return [id, player];
      })
    );

    this.updateSurvivors();

    super.onEnd();
  }
}
