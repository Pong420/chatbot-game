import { Night } from './night';
import { Dark } from './dark';

export class Guard extends Night {
  readonly name = 'Guard';

  next() {
    return Dark;
  }
}
