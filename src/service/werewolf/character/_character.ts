import { plainToInstance, Type } from 'class-transformer';
import { VoteResult, CauseOfDeath, Death, deathSubTypes } from '../death';
import { Constructable } from '@/types';

export class Character {
  id: string; // user id
  name: string; // nick name
  character: string;

  turn = 1;
  endTurn = true;

  @Type(() => Death, {
    discriminator: {
      property: '__type',
      subTypes: deathSubTypes
    }
  })
  causeOfDeath: CauseOfDeath[] = [];

  is<C extends typeof Character>(CharacterConstructor: C) {
    if (!(this instanceof CharacterConstructor)) {
      throw new Error(`expect ${CharacterConstructor.name} but it is ${this['name']}`);
    }
    return this as InstanceType<C>;
  }

  get isDead() {
    return this.causeOfDeath.length > 0;
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

  isKilledBy(character: Character) {
    return this.causeOfDeath.some(c => c instanceof Character && c.id === character.id);
  }

  isKillByVoting() {
    return this.causeOfDeath.some(c => c instanceof VoteResult);
  }

  heal() {
    this.causeOfDeath.shift();
  }
}
