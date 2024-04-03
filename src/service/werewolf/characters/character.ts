export type CauseOfDeath = Character | VoteResult;

export class VoteResult {
  votes: string[] = [];
  total: number;

  constructor(votes: string[], total: number) {
    this.votes = votes;
    this.total = total;
  }

  percetage() {
    return Math.round((this.votes.length / this.total) * 100);
  }
}

export class Character {
  name: string;

  userId: string;

  turn = 1;

  causeOfDeath: CauseOfDeath[] = [];

  constructor(userId: string) {
    this.userId = userId;
  }

  get isDead() {
    return this.causeOfDeath.length > 0;
  }

  dead(causeOfDeath: CauseOfDeath) {
    // if (causeOfDeath instanceof WereWolf && this.protectedBy) {
    //   this.protectedBy.protected.push(this);
    //   this.protectedBy = undefined;
    //   return;
    // }
    this.causeOfDeath.push(causeOfDeath);
  }

  isKilledBy(character: Character) {
    return this.causeOfDeath.some(c => c instanceof Character && c.userId === character.userId);
  }

  isKillByVoting() {
    return this.causeOfDeath.some(c => c instanceof VoteResult);
  }

  heal() {
    this.causeOfDeath.shift();
  }
}
