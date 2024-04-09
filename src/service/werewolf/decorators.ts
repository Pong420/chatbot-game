/* eslint-disable @typescript-eslint/no-explicit-any */
import { Constructable } from '@/types';
import { Character } from './character';
import { t } from './locales';
import type { Stage } from './stage';

export interface ActionOptions {
  notYourTurn?: unknown;
  endedTurn?: () => unknown;
}

const _endedTurn = () => {
  throw t('TurnEnded');
};

export function Action(
  get?: () => Constructable<Stage>,
  { notYourTurn = t('NotYourTurn') as unknown, endedTurn = _endedTurn }: ActionOptions = {}
) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value!;

    descriptor.value = function (this: Character, ...args: any) {
      const StageConstructor = get?.();
      if (this.isDead) throw t('YouDead');
      if (!!this.stage && !!StageConstructor && !(this.stage instanceof StageConstructor)) throw notYourTurn;
      if (this.endTurn) throw endedTurn.call(this);

      const res = method.apply(this, args);
      this.endTurn = true;
      return res;
    };
  };
}
