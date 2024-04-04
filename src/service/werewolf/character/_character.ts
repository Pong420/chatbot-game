import { VoteResult, CauseOfDeath } from '../cause-of-death';

export class Character {
  id: string; // user id
  name: string; // nick name
  character: string;

  turn = 1;
  endTurn = true;

  causeOfDeath: CauseOfDeath[] = [];

  get isDead() {
    return this.causeOfDeath.length > 0;
  }

  dead(causeOfDeath: CauseOfDeath) {
    // if (causeOfDeath instanceof Werewolf && this.protectedBy) {
    //   this.protectedBy.protected.push(this);
    //   this.protectedBy = undefined;
    //   return;
    // }
    this.causeOfDeath.push(causeOfDeath);
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
