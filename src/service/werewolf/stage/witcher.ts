import { Night } from './night';
import { Dark } from './dark';

export class Witcher extends Night {
  readonly name = 'Witcher';

  next() {
    return Dark;
  }
}
