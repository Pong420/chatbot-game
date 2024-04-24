import { t } from '../locales';
import { Character } from './_character';

export class Villager extends Character {
  readonly type = 'Villager';
  readonly name = t('Villager');
  readonly good = true;

  votes = [] as string[];

  vote(character: Character): void {
    const message = super.vote(character);
    this.votes.push(character.id);
    return message;
  }
}
