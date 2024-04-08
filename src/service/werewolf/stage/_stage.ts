import { Transform, TransformationType, instanceToPlain, plainToInstance } from 'class-transformer';
import { Constructable } from '@/types';
import { Character, characters } from '../character';
import { t } from '../locales';

const characterMap: Record<string, typeof Character> = {};

for (const k in characters) {
  const constructor = characters[k as keyof typeof characters];
  if (Object.prototype.isPrototypeOf.call(Character, constructor)) {
    characterMap[constructor.name] = constructor;
  }
}

export class Stage {
  readonly name: string;

  host: string; // host userId

  turn = 0;

  @Transform(({ value, options, type }) => {
    return type === TransformationType.CLASS_TO_PLAIN
      ? Array.from(value, ([k, v]) => [k, { ...instanceToPlain(v, options), type: v.constructor.type }])
      : new Map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value.map(([k, v]: [any, any]) => {
            const instance = plainToInstance(characterMap[v['type']] || Character, v, options);
            return [k, instance];
          })
        );
  })
  players = new Map<string, Character>();

  // @Exclude() // TODO: should exclude?
  playersByName: Record<string, Character> = {};

  // @Exclude() // TODO: should exclude?
  survivors: Character[] = [];

  /**
   * TODO: remove it
   */
  as<C extends typeof Stage>(StageConstructor: C) {
    if (!(this instanceof StageConstructor)) {
      throw new Error(`expect ${StageConstructor.name} but it is ${this['name']}`);
    }
    return this as InstanceType<C>;
  }

  getCharacters<C extends Character>(
    CharacterConstructor: Constructable<C>,
    from: Array<Character> | Map<string, Character> = this.players
  ) {
    const targets: C[] = [];
    from.forEach(c => {
      if (c instanceof CharacterConstructor) {
        targets.push(c as C);
      }
    });
    return targets;
  }

  ended() {
    let endTurn = true;
    this.survivors.forEach(player => {
      endTurn = !player.endTurn ? false : endTurn;
    });
    return endTurn;
  }

  next(): typeof Stage {
    throw t('SystemError');
  }

  onStart() {
    this.players.forEach(player => {
      player.stage = this;
      this.playersByName[player.nickname] = player;
    });
    this.survivors = this.survivors.map(survivor => this.players.get(survivor.id)!);
  }

  onEnd() {
    this.survivors = [];
    this.players.forEach(player => {
      player.isDead = player.causeOfDeath.length > 0;
      !player.isDead && this.survivors.push(player);
    });
  }
}
