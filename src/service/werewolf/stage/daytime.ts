import { VoteResult } from '../death';
import { errors } from '../error';
import { Stage } from './_stage';
import { Night } from './night';

export class Daytime extends Stage {
  voted: string[];
  waived: string[];
  candidates?: string[];
  votesResults: Record<string, string[]>;
  finalResults = { total: 0, players: [] as string[] };

  onStart(): void {
    super.onStart();

    this.voted = [];
    this.waived = [];
    this.votesResults = {};
    this.finalResults = { total: 0, players: [] as string[] };

    this.survivors.forEach(character => {
      character.endTurn = false;
      this.votesResults[character.id] = [];
    });
  }

  onEnd(): void {
    const results = this.finalResults;

    for (const id in this.votesResults) {
      const votes = this.votesResults[id];
      if (votes.length && votes.length >= results.total) {
        if (results.total !== votes.length) {
          results.players = [];
        }
        results.total = votes.length;
        results.players.push(id);
      }
    }

    if (results.total) {
      if (results.players.length > 1) {
        this.candidates = [...results.players];
      } else {
        this.candidates = undefined;
        results.players.forEach(id => {
          const player = this.players.get(id)!;
          if (!player) throw errors('SYSTEM_ERROR');
          player.dead(VoteResult, { votes: this.votesResults[id], total: results.total });
        });
      }
    } else {
      // all wavied
    }

    super.onEnd();
  }

  next(): typeof Stage {
    return this.candidates?.length ? Daytime : Night;
  }
}
