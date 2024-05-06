import { Stage } from './_stage';
import { Killed } from '../death';
import { Werewolf, WerewolfDecision } from '../character';
import { randomPick } from '@/utils/random';

export class Night extends Stage {
  readonly name = 'Night';

  handleKill(decision: WerewolfDecision, userId: string) {
    if (decision.type !== 'kill') return;

    const character = this.players.get(decision.target);
    if (!character) return;

    if (character.isProtected.length) {
      character.isProtected = character.isProtected.slice(0, -1);
    } else {
      character.dead(Killed, { userId });
    }
  }

  updateStatus(werewolf: Werewolf, decision: WerewolfDecision) {
    if (decision.type === 'kill') {
      werewolf.killed.push(decision.target);
      werewolf.hungry = false;
    }

    if (decision.type === 'idle') {
      werewolf.hungry = true;
    }
  }

  onStart(stage: Stage): void {
    super.onStart(stage);
    this.survivors.forEach(survivor => {
      if (survivor instanceof Werewolf) {
        survivor.endTurn = false;
        delete survivor.decision;
      }
    });
  }

  onEnd(): void {
    const werewolfs = this.game.getPlayersByCharacter(Werewolf, this.survivors);

    if (this.game.werewolvesKnowEachOthers) {
      const stats: Record<string, WerewolfDecision[]> = {};
      werewolfs.forEach(survivor => {
        if (!survivor.decision) return;
        const d = { ...survivor.decision };
        const key = d.type === 'kill' ? `${d.type}_${d.target}` : d.type;
        stats[key] = stats[key] || [];
        stats[key].push(d);
      });

      let result = { count: 0, decisions: [] as WerewolfDecision[] };
      for (const k in stats) {
        const decisions = stats[k];

        if (decisions.length > result.count) {
          result = { count: decisions.length, decisions: [decisions[0]] };
        } else if (decisions.length === result.count) {
          result = { ...result, decisions: [...result.decisions, decisions[0]] };
        }
      }

      const decision = randomPick(result.decisions);

      this.handleKill(decision, 'werewolves');
      werewolfs.forEach(werewolf => this.updateStatus(werewolf, decision));
    } else {
      werewolfs.forEach(werewolf => {
        const { decision } = werewolf;
        if (!decision) return;
        this.handleKill(decision, werewolf.id);
        this.updateStatus(werewolf, decision);
      });
    }

    super.onEnd();
  }
}
