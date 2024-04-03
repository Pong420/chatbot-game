import { Stage } from './_stage';
import { Vote } from './vote';

export class Daytime extends Stage {
  next() {
    return this.transition(() => Vote);
  }
}
