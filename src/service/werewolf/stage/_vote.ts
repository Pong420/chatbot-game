import { Transform, TransformationType } from 'class-transformer';
import { t } from '../locales';
import { Stage } from './_stage';
import { Voting } from '../death';

const intialResults = { numberOfVotes: 0, count: 0, players: [] as string[], votes: [] as string[] };

export type VoteResult = typeof intialResults;

export class Vote extends Stage {
  voted: string[];

  @Transform(({ type, value }) => (type === TransformationType.CLASS_TO_PLAIN ? Array.from(value) : new Map(value)))
  candidates = new Map<string, string[]>();

  results: VoteResult;

  countResults() {
    const results = { ...this.results };

    this.candidates.forEach((votes, id) => {
      if (votes.length && votes.length >= results.count) {
        if (results.count !== votes.length) {
          results.players = [];
        }
        results.count = votes.length;
        results.players.push(id);
        results.votes = votes;
      }
      results.numberOfVotes += votes.length;
    });

    return results;
  }

  onStart(stage: Stage): void {
    super.onStart(stage);
    this.voted = [];
    this.results = { ...intialResults };
    this.turn += 1;
  }

  onEnd(): void {
    const results = this.countResults();
    this.results = results;

    if (results.count) {
      // true if more than 1 players have the same votes
      if (results.players.length > 1) {
        this.candidates.clear();
        results.players.forEach(id => {
          this.candidates.set(id, []);
        });
      } else {
        const [id] = results.players;
        const player = this.players.get(id);
        if (!player) throw t('SystemError');
        player.dead(Voting, { votes: this.candidates.get(id), total: results.numberOfVotes });
        this.candidates.clear();
      }
    } else {
      // all wavied
      this.candidates.clear();
    }

    super.onEnd();
  }
}
