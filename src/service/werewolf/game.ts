import 'reflect-metadata';
import { Type, plainToInstance, instanceToPlain, Exclude } from 'class-transformer';
import { Constructable } from '@/types';
import { GameInstance, CreateGameOptions } from '@service/game';
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
import { Character, CharacterKey, Werewolf } from './character';
import { t } from './locales';
import { achievementCount } from './achivement';

export interface CreateGame {
  id: string;
  stage?: object;
}

export interface GameSettingOption {
  autoMode?: boolean;
  werewolvesKnowEachOthers?: boolean;
  customCharacters?: CharacterKey[];
}

export interface Game extends GameSettingOption {}

export class Game extends GameInstance {
  static readonly type = 'Werewolf';

  static create({ data }: CreateGameOptions) {
    const game: Game = plainToInstance(Game, data, {
      // for initial value of stage
      exposeUnsetFields: false
    });
    game.stage.game = game;
    game.stage.init();
    return game;
  }

  readonly name = t('GameName');

  groupId: string;

  host: string; // host's userId;

  chat?: string; // chat id

  autoMode = true;

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
    const werewolves = this.getPlayersByCharacter(Werewolf, survivors);
    const werewolvesCount = this.werewolvesKnowEachOthers ? 1 : werewolves.length;
    const survivorsCount = survivors.length - werewolves.length + werewolvesCount;
    const allDead = survivors.length === 0;
    const werewolfWin =
      werewolvesCount > 1
        ? survivors.length <= werewolvesCount // remaining werewolves
        : werewolvesCount === 1 && survivorsCount <= 2; // remaining 1 werewolf and 1 good guy;
    const allWerewolvesDead = !werewolves.length;
    const ended = allDead || allWerewolvesDead || werewolfWin;

    if (ended) {
      return { allDead, allWerewolvesDead, werewolfWin };
    }
  }

  protected transition(NextStage: typeof Stage) {
    const serialized = this.serialize();
    const stage = this.stage;
    this.stage = plainToInstance(NextStage, serialized.stage) as Stage;
    this.stage.game = this;
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

    const getNext = (stage: typeof Stage) => {
      const nextIndex = (stages.indexOf(stage) + 1) % stages.length;
      return stages[nextIndex];
    };

    const NextStage = getNext(CurrStage);

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
      return this.stage.ref === 'vote' ? getNext(Voted) : Vote;
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

  getAchivement(): [userId: string, payload: Record<string, number>][] {
    if (this.stage.turn <= 1) return [];
    return Array.from(this.players, ([userId, player]) => [userId, achievementCount(player, this)]);
  }
}

export { Game as Werewolf };
