import { Constructable } from '@/types';
import { Character } from './character';
import { errors } from './error';
import type { Stage } from './stage';

export function Action(get?: () => Constructable<Stage>) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    let method = descriptor.value!;
    // eslint-disable-next-line no-unused-vars
    descriptor.value = function (this: Character) {
      const StageConstructor = get?.();
      if (this.isDead) throw errors('YOU_DEAD');
      if (!!this.stage && !!StageConstructor && !(this.stage instanceof StageConstructor))
        throw errors('NOT_YOUR_TURN');
      if (this.endTurn) throw errors('TURN_ENDED');

      try {
        const res = method.apply(this, arguments);
        this.endTurn = true;
        return res;
      } catch (error) {
        throw error;
      }
    };
  };
}
