import { Stage } from './_stage';
import { Werewolf } from '../character';

export class End extends Stage {
  readonly name = 'End';

  /**
   * TODO: test the end message
   */
  getEndMessage(): string {
    const werewolves = this.getPlayersByCharacter(Werewolf);
    const werewolveAlive = werewolves.filter(c => !c.isDead);
    const allWerewolvesAlive = werewolves.every(c => !c.isDead);
    const aliveExceptWereWolves = [...this.players]
      .filter(([, c]) => !(c instanceof Werewolf))
      .every(([, c]) => !c.isDead);

    if (this.turn === 0 || this.survivors.length === this.players.size) {
      return `可惜，未開始，已經結束...`;
    }

    // should not happen in this version?
    // TODO: werewolf kill hunter -> end game
    if (!this.survivors.length) {
      return `都死了，這是一場沒有「水平」的遊戲！`;
    }

    if (allWerewolvesAlive) {
      return `狼人大獲全勝，村民的怨魂開始互相撕逼「你們這群暴民！」「你們搞門派的，心都髒！」`;
    }

    if (aliveExceptWereWolves) {
      return `「不可能！」「你們這是作弊！」狼人還未出手就被發現了，村民大獲全勝`;
    }

    if (!werewolveAlive.length && this.survivors.length) {
      return `「是你！」最後的狼人被發現了，倖存的人拿起農具走向狼人`;
    }

    // TODO: weird
    if (werewolveAlive.length > 1 && this.survivors.length <= werewolveAlive.length) {
      return `「呼，最後一個都解決了！」是狼人的勝利！`;
    }

    if (werewolveAlive.length === 1 && this.survivors.length === 2) {
      const [target, werewolf] = this.survivors.sort(a => (a instanceof Werewolf ? 1 : -1));
      target.isKilledBy(werewolf);
      return `「嘿，剩最後下一個了！」，狼人露出真身，走向最後的倖存者`;
    }

    if (this.survivors.length === 1) {
      if (werewolveAlive.length === 1) {
        return `「結束了...這次的獵物有點難纏啊」`;
      } else {
        return `「還...還有人在嗎？」`;
      }
    }

    if (this.survivors.length && werewolveAlive.length && this.survivors.length > 1) {
      return `遊戲終止，再來一局嗎？`;
    }

    return `未考慮到的結局，請各位自行腦補`;
  }
}
