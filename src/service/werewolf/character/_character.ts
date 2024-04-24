import { Exclude, plainToInstance, Type } from 'class-transformer';
import { Constructable } from '@/types';
import { CauseOfDeath, Death, deathSubTypes, Killed } from '../death';
import { ReVote, VoteBaseStage, type Stage } from '../stage';
import { Action } from '../decorators';
import { t } from '../locales';

export class Character {
  readonly type: string;
  readonly name: string; // translated character name\
  readonly good: boolean; // for predictor

  readonly id: string; // user id

  readonly nickname: string;

  turn = 1;
  endTurn = true;

  isDead = false;

  @Type(() => Death, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: deathSubTypes
    }
  })
  causeOfDeath: CauseOfDeath[] = [];

  isProtected: string[] = [];

  @Exclude()
  stage: Stage;

  // TODO:
  // statistics / action logs
  // - number of votes, who vote most

  dead<C extends CauseOfDeath>(causeOfDeath: Constructable<C>, payload: { [K in Exclude<keyof C, 'type'>]?: C[K] }) {
    const instance = plainToInstance(causeOfDeath, payload);
    this.causeOfDeath.push(instance);
  }

  @Action(() => VoteBaseStage, {
    notYourTurn: () => t('VoteNotStarted'),
    turnEnded(character: Character) {
      if (character.stage instanceof ReVote && !character.stage.voter.includes(character.id)) {
        return t(`CandidateCantVote`);
      }
      return t(`TurnEnded`);
    }
  })
  vote(character: Character) {
    const stage = this.stage as VoteBaseStage;
    if (character.isDead) throw t('CantKillDeadTarget', character.id === this.id ? t('Self') : character.nickname);
    if (stage.voted.includes(this.id)) throw t('Voted');
    if (!stage.candidates.has(character.id)) throw t('VoteOutOfRange');
    stage.voted.push(this.id);
    stage.candidates.get(character.id)!.push(this.id);
  }

  @Action(() => VoteBaseStage, { notYourTurn: () => false })
  waive() {
    const stage = this.stage as VoteBaseStage;
    stage.voted.push(this.id);
  }

  isKilledBy(character: Character) {
    return this.causeOfDeath.some(c => c instanceof Killed && c.userId === character.id);
  }
}
