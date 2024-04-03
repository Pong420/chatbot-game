import 'reflect-metadata';
import { instanceToPlain, plainToInstance, Transform, TransformationType, Type } from 'class-transformer';
import { randomPick } from '@/utils/random';
import { Constructable } from '@/types';
import { Character } from './characters/character';
import { Villager } from './characters/villager';
import { WereWolf } from './characters/werewolf';
import { Player } from './player';
import MESSAGE from './locales';

export type Stage = 'pending' | 'start' | 'daytime' | 'night' | 'end';

const characterMap = [Villager, WereWolf].reduce(
  (res, cls) => ({ ...res, [cls.name]: cls }),
  {} as Record<string, Constructable<typeof Character>>
);

export class WerewolfGame {
  id: string;

  stage = 'pending';

  numOfPlayers = 6;

  @Type(() => Player)
  @Transform(({ value }) => (value instanceof Map ? Array.from(value.entries()) : []), { toPlainOnly: true })
  @Transform(({ value }) => new Map(value), { toClassOnly: true })
  players = new Map<string, Player>();

  @Transform(({ value, options, type }) => {
    return type === TransformationType.CLASS_TO_PLAIN
      ? Array.from(value.entries(), ([k, v]) => [k, { ...instanceToPlain(v, options), __type: v.constructor.name }])
      : new Map(
          value.map(([k, v]: [any, any]) => {
            const instance = plainToInstance(characterMap[v['__type']], v, options);
            // @ts-expect-error
            delete instance['__type'];
            return [k, instance];
          })
        );
  })
  characters = new Map<string, Character>();

  constructor(initialState: Partial<WerewolfGame>) {
    Object.assign(this, { ...initialState });
  }

  join(player: Player) {
    if (this.players.has(player.id)) {
      return MESSAGE.DUPLICATED_JOIN;
    }

    if (this.players.size === this.numOfPlayers) {
      return MESSAGE.MAXIMUM_PLAYERS_EXCEED;
    }

    this.players.set(player.id, plainToInstance(Player, player));
  }

  setCharacters() {
    if (this.characters.size) throw Error(`setCharacters: bad implementation`);

    const werewolfs = [WereWolf];
    const characters: Constructable<typeof Character>[] = [
      ...werewolfs,
      ...Array.from({ length: this.players.size - werewolfs.length }, () => Villager)
    ];

    this.players.forEach(p => {
      const Character = randomPick(characters);
      p.character = new Character(p.id);
      this.characters.set(p.id, p.character);
    });
  }

  nextStage() {
    const stage = this.getNextStage();
    if (stage) {
      this.stage = stage;
    }
  }

  getNextStage(): Stage | void {
    switch (this.stage) {
      case 'pending':
        if (this.players.size < this.numOfPlayers) {
          throw MESSAGE.NOT_ENOUGH_PLAYERS;
        }
        return 'start';
      case 'start':
        this.setCharacters();
        return 'night';
      case 'night':
        // TODO:end
        return 'daytime';
      case 'daytime':
        return 'night';
    }
  }
}
