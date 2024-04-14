import { Action } from '@werewolf/decorators';
import { t } from '../locales';
import { Guard as GuardStage } from '../stage';
import { Character } from './_character';

export class Guard extends Character {
  readonly type = 'Guard';
  readonly name = t('Guard');
  readonly good = true;

  protected: string[] = []; // a history for who is protected
  protecting?: string;

  @Action(() => GuardStage)
  protect(character: Character) {
    const self = character.id === this.id;
    if (character.isDead) throw self ? t('YouDead') : t('TargetIsDead', character.nickname);
    if (character.id === this.protecting) {
      throw self ? t('DuplicatedProtectedSelf') : t('DuplicatedProtected');
    }
    this.protecting = character.id;
    this.protected.push(this.protecting);
    character.isProtected.push(this.id);
    return self ? t('ProtectSelfSuccess') : t(`ProtectSuccess`);
  }

  @Action(() => GuardStage)
  noProtect() {
    delete this.protecting;
    return t(`NoProtectSuccess`);
  }
}
