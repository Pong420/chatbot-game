import { t } from '../locales';
import { Character } from './_character';

export class Hunter extends Character {
  readonly type = 'Hunter';
  readonly name = t('Hunter');
}
