import { Character } from './character';
import { errors } from './error';

export function Action() {
  return function Action(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    let method = descriptor.value!;

    // eslint-disable-next-line no-unused-vars
    descriptor.value = function (this: Character) {
      if (this.endTurn) throw errors('END_TURN');
      this.endTurn = true;
      return method.apply(this, arguments);
    };
  };
}
