import { Stage } from './_stage';
import { Daytime } from './daytime';

export class Night extends Stage {
  next() {
    return this.transition(() => Daytime);
  }
}
