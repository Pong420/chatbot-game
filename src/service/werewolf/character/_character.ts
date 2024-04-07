import { Exclude, plainToInstance, Type } from 'class-transformer';
import { Constructable } from '@/types';
import { Voted, CauseOfDeath, Death, deathSubTypes, Killed } from '../death';
import { Daytime, type Stage } from '../stage';
import { Action } from '../decorators';
import { t } from '../locales';

export class Character {
  id: string; // user id

  nickname: string;

  turn = 1;
  endTurn = true;
  isDead = false;

  @Type(() => Death, {
    discriminator: {
      property: '__type',
      subTypes: deathSubTypes
    }
  })
  causeOfDeath: CauseOfDeath[] = [];

  @Exclude()
  stage: Stage;

  // TODO:
  // statistics / action logs
  // - number of votes, who vote most

  is<C extends typeof Character>(CharacterConstructor: C) {
    if (!(this instanceof CharacterConstructor)) {
      throw new Error(`expect ${CharacterConstructor.name} but it is ${this['name']}`);
    }
    return this as InstanceType<C>;
  }

  heal() {
    this.causeOfDeath.shift();
  }

  dead<C extends CauseOfDeath>(causeOfDeath: Constructable<C>, payload: { [K in keyof C]?: C[K] }) {
    const instance = plainToInstance(causeOfDeath, payload);
    // if (causeOfDeath instanceof Werewolf && this.protectedBy) {
    //   this.protectedBy.protected.push(this);
    //   this.protectedBy = undefined;
    //   return;
    // }
    this.causeOfDeath.push(instance);
  }

  @Action(() => Daytime)
  vote(character: Character) {
    const stage = this.stage.as(Daytime);
    if (character.isDead) throw t('TargetIsDead', character.id === this.id ? t('Self') : character.nickname);
    if (stage.Voted.includes(this.id)) throw t('Voted');
    if (!stage.candidates.has(character.id)) throw t('VoteOutOfRange');
    stage.Voted.push(this.id);
    stage.candidates.get(character.id)!.push(this.id);
    return { self: this.id === character.id };
  }

  @Action(() => Daytime)
  waive() {
    const stage = this.stage.as(Daytime);
    stage.Voted.push(this.id);
  }

  isKilledBy(character: Character) {
    return this.causeOfDeath.some(c => c instanceof Killed && c.userId === character.id);
  }

  isKillByVoted() {
    return this.causeOfDeath.some(c => c instanceof Voted);
  }
}
