import { t } from '../locales';
import { Character } from './_character';

export class Guard extends Character {
  readonly type = 'Guard';
  readonly name = t('Guard');
}
