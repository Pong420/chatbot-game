import { DiscriminatorDescriptor } from 'class-transformer';
import { Constructable } from '@/types';
import { Stage } from './stage/_stage';
import * as stages from './stage/_stages';

export type Stages = {
  [K in keyof typeof stages]: Constructable<InstanceType<(typeof stages)[K]>>;
};

export const stagesTypes: DiscriminatorDescriptor['subTypes'] = [];

for (const k in stages) {
  const value = stages[k as keyof Stages];
  if (Object.prototype.isPrototypeOf.call(Stage, value)) {
    stagesTypes.push({ name: k, value });
  }
}

export { stages };
export * from './stage/_stage';
export * from './stage/_stages';
export * from './stage/_vote';
