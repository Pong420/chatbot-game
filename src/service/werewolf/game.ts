import { Type, DiscriminatorDescriptor, plainToInstance, instanceToPlain } from 'class-transformer';
import { Constructable } from '@/types';
import { stages, Init, Stage, End } from './stage';
import { Character, Werewolf } from './character';
import { t } from './locales';

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
  static readonly type: string = 'Werewolf';

  readonly name = t('GameName');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static create({ data, ...payload }: { groupId: string; data?: any }) {
    return plainToInstance(
      Game,
      {
        ...payload,
        // not require data will be modiflied, `{ ...data }` is required
        stage: data && { ...data }
      },
      {
        // for initial value of stage
        exposeUnsetFields: false
      }
    ) as Game;
  }

  groupId: string;

  @Type(() => Stage, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'name',
      subTypes
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

  getCharacters<C extends Character>(
    CharacterConstructor: Constructable<C>,
    from?: Array<Character> | Map<string, Character>
  ) {
    return this.stage.getCharacters(CharacterConstructor, from);
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
    // FIXME: make this better
    const { name, ...stage } = instanceToPlain(this.stage);
    this.stage = plainToInstance(NextStage, stage) as Stage;
    this.stage.onStart();
    return this.stage;
  }
}

export { Game as Werewolf };
