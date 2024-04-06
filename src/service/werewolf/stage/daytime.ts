import { Transform, TransformationType } from 'class-transformer';
import { Voted } from '../death';
import { t } from '../messages';
import { Stage } from './_stage';
import { Night } from './night';

const intialResults = { numberOfVotes: 0, count: 0, players: [] as string[] };

export class Daytime extends Stage {
  Voted: string[];

  @Transform(({ type, value }) => (type === TransformationType.CLASS_TO_PLAIN ? Array.from(value) : new Map(value)))
  candidates = new Map<string, string[]>();

  results: typeof intialResults;

  countResults() {
    const results = { ...this.results };

    this.candidates.forEach((votes, id) => {
      if (votes.length && votes.length >= results.count) {
        if (results.count !== votes.length) {
          results.players = [];
        }
        results.count = votes.length;
        results.players.push(id);
      }
      results.numberOfVotes += votes.length;
    });

    return results;
  }

  onStart(): void {
    super.onStart();
    this.Voted = [];
    this.results = { ...intialResults };

    /**
     * this.candidates.size > 0 if previous round multiple players have the some votes
     */
    if (!this.candidates.size) {
      this.survivors.forEach(survivor => {
        this.candidates.set(survivor.id, []);
      });
    }

    this.survivors.forEach(character => {
      character.endTurn = false;
    });
  }

  onEnd(): void {
    const results = this.countResults();
    this.results = results;

    if (results.count) {
      // true if more than 1 players have the same votes
      if (results.players.length > 1) {
        // update the candidates for next round
        this.candidates.clear();
        results.players.forEach(id => {
          this.candidates.set(id, []);
        });
      } else {
        const [id] = results.players;
        const player = this.players.get(id);
        if (!player) throw t('SystemError');
        player.dead(Voted, { votes: this.candidates.get(id), total: results.numberOfVotes });
        this.candidates.clear();
      }
    } else {
      // all wavied
    }

    super.onEnd();
  }

  next(): typeof Stage {
    return this.candidates.size ? Daytime : Night;
  }
}
