/* eslint-disable @typescript-eslint/no-explicit-any */
import { Constructable } from '@/types';
import { Character } from './character';
import { t } from './locales';
import type { Stage } from './stage';

export function Action(get?: () => Constructable<Stage>) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value!;

    descriptor.value = function (this: Character, ...args: any) {
      const StageConstructor = get?.();
      if (this.isDead) throw t('YouDead');
      if (!!this.stage && !!StageConstructor && !(this.stage instanceof StageConstructor)) throw t('NotYourTurn');
      if (this.endTurn) throw t('TurnEnded');

      const res = method.apply(this, args);
      this.endTurn = true;
      return res;
    };
  };
}
