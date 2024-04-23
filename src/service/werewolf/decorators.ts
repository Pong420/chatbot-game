/* eslint-disable @typescript-eslint/no-explicit-any */
import { Constructable } from '@/types';
import { Character } from './character';
import { t } from './locales';
import type { Stage } from './stage';

export interface ActionOptions {
  actionAfterDead?: boolean;
  notYourTurn?: (character: any) => unknown;
  turnEnded?: (character: any) => unknown;
}

export function Action(
  get?: () => Constructable<Stage>,
  {
    actionAfterDead = false,
    notYourTurn = () => t('NotYourTurn') as unknown,
    turnEnded = () => t('TurnEnded')
  }: ActionOptions = {}
) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value!;

    descriptor.value = function (this: Character, ...args: any) {
      const StageConstructor = get?.();
      if (this.isDead && !actionAfterDead) throw t('YouDead');
      if (!!this.stage && !!StageConstructor && !(this.stage instanceof StageConstructor)) throw notYourTurn(this);
      if (this.endTurn) throw turnEnded(this);

      const res = method.apply(this, args);
      this.endTurn = true;
      return res;
    };
  };
}
