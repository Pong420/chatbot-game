import { plainToInstance } from 'class-transformer';
import { randomPick } from '@/utils/random';
import { Character, Villager, Werewolf } from '../character';
import { Stage } from './_stage';
import { Night } from './night';
import type { Init } from './init';
import { t } from '../locales';

/**
 * For extends configuration from Init
 */
export interface Start extends Omit<Init, 'name'> {}

export class Start extends Stage {
  readonly name = 'Start';

  join(player: Pick<Character, 'id' | 'nickname'>) {
    if (this.players.has(player.id)) throw t('Joined', player.nickname);
    if (this.players.size >= 12) throw t('GameIsFull', player.nickname);

    for (const [, c] of this.players.entries()) {
      if (player.nickname === c.nickname) throw t(`NicknameUsed`, player.nickname);
    }

    this.players.set(player.id, plainToInstance(Character, player));
  }

  next() {
    return Night;
  }

  onEnd(): void {
    if (this.players.size < 6) throw t('NoEnoughPlayers');

    const characters: (typeof Character)[] = [Werewolf];
    while (characters.length < this.players.size) {
      characters.push(Villager);
    }

    this.players = new Map(
      Array.from(this.players, ([k, v]) => [k, plainToInstance(randomPick(characters), { ...v })])
    );

    super.onEnd();
  }
}
