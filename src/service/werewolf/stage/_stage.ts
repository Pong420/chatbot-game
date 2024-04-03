import 'reflect-metadata';
import { Transform, TransformationType, Type } from 'class-transformer';
import { Character } from '../character';

export class Stage {
  name: string;

  numOfPlayers = 6;

  @Type(() => Character)
  @Transform(({ value, type }) => (type === TransformationType.CLASS_TO_PLAIN ? Array.from(value) : new Map(value)))
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

  next(): typeof Stage {
    throw `bad implementation`;
  }

  onStart() {}
  onEnd() {}
}
