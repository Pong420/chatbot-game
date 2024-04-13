import { Action } from '@werewolf/decorators';
import { t } from '../locales';
import { Guard as GuardStage } from '../stage';
import { Character } from './_character';

export class Guard extends Character {
  readonly type = 'Guard';
  readonly name = t('Guard');

  protected: string[] = []; // protect success, for report
  protecting?: string;

  @Action(() => GuardStage)
  protect(character: Character) {
    const self = character.id === this.id;
    if (character.id === this.protecting) {
      throw self ? t('DuplicatedProtectedSelf') : t('DuplicatedProtected');
    }
    this.protecting = character.id;
    this.protected.push(this.protecting);
    return self ? t('ProtectSelfSuccess') : t(`ProtectSuccess`);
  }

  @Action(() => GuardStage)
  noProtect() {
    this.protecting = undefined;
    return t(`NoProtectSuccess`);
  }
}
