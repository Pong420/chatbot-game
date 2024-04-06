import { Type, DiscriminatorDescriptor, plainToInstance, instanceToPlain } from 'class-transformer';
import { Constructable } from '@/types';
import { stages, Init, Stage, End } from './stage';
import { Character, Werewolf } from './character';
import { t } from './messages';

const subTypes: DiscriminatorDescriptor['subTypes'] = [];

for (const k in stages) {
  const value = stages[k as keyof typeof stages];
  if (Object.prototype.isPrototypeOf.call(Stage, value)) {
    subTypes.push({ name: value.name, value });
  }
}

export interface CreateGame {
  id: string;
  stage?: object;
}

export class Game {
  static create(payload: object) {
    return plainToInstance(Game, payload, { exposeUnsetFields: false }) as Game;
  }

  static serialize(payload: Game) {
    return instanceToPlain(payload);
  }

  id: string;

  @Type(() => Stage, {
    discriminator: {
      property: '__type',
      subTypes
    }
  })
  stage: Stage = new Init();

  get players() {
    return this.stage.players;
  }

  getCharacters<C extends Character>(
    CharacterContructor: Constructable<C>,
    from?: Array<Character> | Map<string, Character>
  ) {
    return this.stage.getCharacters(CharacterContructor, from);
  }

  shouldEndGame() {
    if (this.stage instanceof Init) return;

    const survivors = this.stage.survivors;
    const werewolfs = this.getCharacters(Werewolf, survivors);
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

  next() {
    // TODO:
    if (!this.stage.ended()) throw t('StageNotEnded');
    this.stage.onEnd();

    const NextStage = this.shouldEndGame() ? End : this.stage.next();
    this.stage = plainToInstance(NextStage, instanceToPlain(this.stage)) as Stage;
    this.stage.onStart();
    return this.stage;
  }
}
