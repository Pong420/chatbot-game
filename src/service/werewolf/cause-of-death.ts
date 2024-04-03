import { Character } from './character';

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
