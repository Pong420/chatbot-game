import 'reflect-metadata';
import { Transform, TransformationType, instanceToPlain, plainToInstance } from 'class-transformer';
import { Character, characters } from '../character';
import { errors } from '../error';

// const subTypes: DiscriminatorDescriptor['subTypes'] = [];
const characterMap: Record<string, typeof Character> = {};

for (const k in characters) {
  const value = characters[k as keyof typeof characters];
  if (Object.prototype.isPrototypeOf.call(Character, value)) {
    characterMap[value.name] = value;
  }
}

export class Stage {
  __type: string;

  numOfPlayers = 6;

  @Transform(({ value, options, type }) => {
    return type === TransformationType.CLASS_TO_PLAIN
      ? Array.from(value.entries(), ([k, v]) => [k, { ...instanceToPlain(v, options), __type: v.constructor.name }])
      : new Map(
          value.map(([k, v]: [any, any]) => {
            const instance = plainToInstance(characterMap[v['__type']], v, options);
            return [k, instance];
          })
        );
  })
  players = new Map<string, Character>();

  survivors: Character[] = [];

  constructor() {
    this['__type'] = this['constructor'].name;
  }

  /**
   * TODO: remove it
   */
  as<C extends typeof Stage>(StageConstructor: C) {
    if (!(this instanceof StageConstructor)) {
      throw new Error(`expect ${StageConstructor.name} but it is ${this['name']}`);
    }
    return this as InstanceType<C>;
  }

  getCharacters<C extends typeof Character>(CharacterContructor: C) {
    const targets: InstanceType<C>[] = [];
    this.players.forEach(c => {
      if (c instanceof CharacterContructor) {
        targets.push(c as InstanceType<C>);
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
    throw errors('SYSTEM_ERROR');
  }

  onStart() {
    this.survivors = [];
    this.players.forEach(player => {
      player.stage = this;
      player.isDead = player.causeOfDeath.length > 0;
      !player.isDead && this.survivors.push(player);
    });
  }

  onEnd() {}
}
