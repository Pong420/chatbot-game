import { instanceToPlain, plainToInstance } from 'class-transformer';
import { randomPick } from '@/utils/random';
import { Character, Villager, Werewolf } from '../character';
import { t } from '../locales';
import { Stage } from './_stage';
import { Dark } from './dark';
import type { Init } from './init';

/**
 * For extends configuration from Init
 */
export interface Start extends Omit<Init, 'name'> {}

export class Start extends Stage {
  readonly name = 'Start';

  join(payload: Pick<Character, 'id' | 'nickname'>) {
    if (this.players.has(payload.id)) throw t('Joined', payload.nickname);
    if (this.players.size >= 12) throw t('GameIsFull', payload.nickname);

    for (const player of this.players.values()) {
      if (payload.nickname === player.nickname) throw t(`NicknameUsed`, payload.nickname);
    }

    const player = plainToInstance(Character, payload);
    this.players.set(player.id, player);
    this.playersByName[player.nickname] = player;
  }

  next() {
    return Dark;
  }

  onEnd(): void {
    if (this.players.size < 6) throw t('NoEnoughPlayers');

    const characters: (typeof Character)[] = [Werewolf];
    while (characters.length < this.players.size) {
      characters.push(Villager);
    }

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
