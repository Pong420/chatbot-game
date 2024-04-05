/* eslint-disable @typescript-eslint/no-explicit-any */
import { Constructable } from '@/types';
import { Character } from './character';
import { errors } from './error';
import type { Stage } from './stage';

export function Action(get?: () => Constructable<Stage>) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value!;

    descriptor.value = function (this: Character, ...args: any) {
      const StageConstructor = get?.();
      if (this.isDead) throw errors('YOU_DEAD');
      if (!!this.stage && !!StageConstructor && !(this.stage instanceof StageConstructor))
        throw errors('NOT_YOUR_TURN');
      if (this.endTurn) throw errors('TURN_ENDED');

      const res = method.apply(this, args);
      this.endTurn = true;
      return res;
    };
  };
}
