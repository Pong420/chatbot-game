/* eslint-disable @typescript-eslint/no-explicit-any */
import { Constructable } from '@/types';
import { Character } from './character';
import { t } from './messages';
import type { Stage } from './stage';

export function Action(get?: () => Constructable<Stage>) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value!;

    descriptor.value = function (this: Character, ...args: any) {
      const StageConstructor = get?.();
      if (this.isDead) throw t('YOU_DEAD');
      if (!!this.stage && !!StageConstructor && !(this.stage instanceof StageConstructor)) throw t('NOT_YOUR_TURN');
      if (this.endTurn) throw t('TURN_ENDED');

      const res = method.apply(this, args);
      this.endTurn = true;
      return res;
    };
  };
}
