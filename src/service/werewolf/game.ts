import 'reflect-metadata';
import { Type, plainToInstance, instanceToPlain } from 'class-transformer';
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
  Daytime,
  Voted,
  ReVote
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
  static create({ data, ...payload }: { groupId: string; data?: any }) {
    const game = plainToInstance(
      Game,
      { ...payload, stage: data },
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

  @Type(() => Stage, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'name',
      subTypes: stagesTypes
    }
  })
  stage: Stage = new Init();

  get players() {
    return this.stage.players;
  }

  serialize() {
    const { groupId, stage } = instanceToPlain(this);
    return { groupId, data: stage };
  }

  // id or name
  getPlayer(key: string) {
    return this.stage.players.get(key) || this.stage.playersByName[key];
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
    if (this.stage instanceof Init) return;
    if (this.stage instanceof Start) return;

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

  protected nextStage(NextStage: typeof Stage) {
    const { data } = this.serialize();
    this.stage = plainToInstance(NextStage, data) as Stage;
    this.stage.onStart();
  }

  getNextStage(current = this.stage.constructor as typeof Stage): typeof Stage {
    if (current === Init) return Start;

    const orders: (typeof Stage)[] = [
      Guard,
      Night, // werewolf
      Witcher,
      Predictor,
      Daytime,
      ReVote,
      Voted
    ];

    const nextIndex = (orders.indexOf(current) + 1) % orders.length;
    const NextStage = orders[nextIndex];

    if (!NextStage) {
      throw `cannot get next stage from ${this.stage.name}`;
    }

    if (typeof NextStage.available === 'function') {
      if (!NextStage.available(this.stage)) {
        return this.getNextStage(NextStage);
      }
    }

    return NextStage;
  }

  next() {
    if (!this.stage.ended()) throw t('StageNotEnded');
    this.stage.onEnd();

    const NextStage = this.getNextStage();
    this.nextStage(NextStage);

    if (this.shouldEndGame()) {
      this.nextStage(End);
    }

    return this.stage;
  }
}

export { Game as Werewolf };
