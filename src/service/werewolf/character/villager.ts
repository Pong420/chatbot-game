import { t } from '@werewolf/locales';
import { Character } from './_character';

export class Villager extends Character {
  readonly type = 'Villager';
  readonly name = t('Villager');
}
