import 'reflect-metadata';
import { Transform, TransformationType, instanceToPlain, plainToInstance } from 'class-transformer';
import { Character, characters } from '../character';

const characterMap: Record<string, typeof Character> = {};

for (const k in characters) {
  const value = characters[k as keyof typeof characters];
  if (Object.prototype.isPrototypeOf.call(Character, value)) {
    characterMap[value.name] = value;
  }
}

export class Stage {
  numOfPlayers = 6;

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
  players = new Map<string, Character>();

  constructor(initialState?: object) {
    Object.assign(this, { ...initialState });
  }

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

  endTurn() {
    let endTurn = true;
    this.players.forEach(player => {
      if (!player.endTurn) {
        endTurn = false;
      }
    });
    return endTurn;
  }

  next(): typeof Stage {
    throw `bad implementation`;
  }

  onStart() {}
  onEnd() {}
}
