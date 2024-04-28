import 'reflect-metadata';
import { Type, plainToInstance, instanceToPlain, Exclude } from 'class-transformer';
import { Constructable, GameInstance } from '@/types';
import {
  stagesTypes,
  Init,
  Stage,
  End,
  Start,
  Guard,
  Night,
  Witcher,
  Predictor,
  Hunter,
  Daytime,
  Vote,
  ReVote,
  Voted,
  HunterEnd
} from './stage';
import { Character, Werewolf } from './character';
import { t } from './locales';

export interface CreateGame {
  id: string;
  stage?: object;
}

export class Game extends GameInstance {
  static readonly type: string = 'Werewolf';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static create(payload: Record<string, any>) {
    const game = plainToInstance(
      Game,
      { ...payload },
      {
        // for initial value of stage
        exposeUnsetFields: false
      }
    ) as Game;
    game.stage.init();
    return game;
  }

  readonly name = t('GameName');

  groupId: string;

  host: string; // host's userId;

  @Type(() => Stage, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'name',
      subTypes: stagesTypes
    }
  })
  stage: Stage = new Init();

  @Exclude()
  get players() {
    return this.stage.players;
  }

  serialize() {
    return instanceToPlain(this);
  }

  // id or name
  getPlayer<C extends Character>(key: string) {
    return (this.stage.players.get(key) || this.stage.playersByName[key]) as C;
  }

  getPlayersByCharacter<C extends Character>(
    CharacterConstructor: Constructable<C>,
    from: Array<Character> | Map<string, Character> = this.players
  ) {
    const targets: C[] = [];
    from.forEach(c => {
      if (c instanceof CharacterConstructor) {
        targets.push(c as C);
      }
    });
    return targets;
  }

  protected shouldEndGame() {
    const survivors = this.stage.survivors;
    const werewolfs = this.getPlayersByCharacter(Werewolf, survivors);
    const allDead = survivors.length === 0;
    const werewolfWin =
      werewolfs.length > 1
        ? survivors.length <= werewolfs.length // remaining werewolfs
        : werewolfs.length === 1 && survivors.length <= 2; // remaining 1 werewolf and 1 good guy;
    const allWerewolfsDead = !werewolfs.length;
    const ended = allDead || allWerewolfsDead || werewolfWin;

    if (ended) {
      return { allDead, allWerewolfsDead, werewolfWin };
    }
  }

  protected transition(NextStage: typeof Stage) {
    const serialized = this.serialize();
    const stage = this.stage;
    this.stage = plainToInstance(NextStage, serialized.stage) as Stage;
    this.stage.onStart(stage);
  }

  getNextStage(CurrStage = this.stage.constructor as typeof Stage): typeof Stage {
    if (CurrStage === Init) return Start;

    if (this.shouldEndGame()) {
      return End;
    }

    const stages: (typeof Stage)[] = [
      Guard,
      Night, // werewolf
      Witcher,
      Predictor,
      Daytime,
      Vote,
      ReVote,
      Voted
    ];

    const nextIndex = (stages.indexOf(CurrStage) + 1) % stages.length;
    const NextStage = stages[nextIndex];

    if (!NextStage) {
      throw `cannot get next stage from ${this.stage.name}`;
    }

    if ((CurrStage === Daytime || CurrStage === Voted) && Hunter.available(this.stage)) {
      return Hunter;
    }

    if (this.stage instanceof Hunter) {
      return HunterEnd;
    }

    if (this.stage instanceof HunterEnd) {
      return this.stage.ref === 'vote' ? this.getNextStage(Voted) : Vote;
    }

    if (typeof NextStage.available === 'function' && !NextStage.available(this.stage)) {
      return this.getNextStage(NextStage);
    }

    return NextStage;
  }

  next() {
    if (!this.stage.ended()) throw t('StageNotEnded');
    this.stage.onEnd();

    const NextStage = this.getNextStage();
    this.transition(NextStage);

    return this.stage;
  }

  skip() {
    this.stage.survivors.forEach(c => {
      c.endTurn = true;
    });
    return this.next();
  }
}

export { Game as Werewolf };
