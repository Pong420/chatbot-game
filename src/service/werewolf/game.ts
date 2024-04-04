import { Type, DiscriminatorDescriptor, plainToInstance, instanceToPlain } from 'class-transformer';
import { Init, Stage, stages } from './stage';
import { errors } from './error';
import { Character } from './character';

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

  getCharacters<C extends typeof Character>(CharacterContructor: C) {
    return this.stage.getCharacters(CharacterContructor);
  }

  serialize() {
    return instanceToPlain(this) as Game;
  }

  next() {
    // TODO:
    if (!this.stage.endTurn()) throw errors('NOT_END');
    const Stage = this.stage.next();
    this.stage.onEnd();
    this.stage = plainToInstance(Stage, instanceToPlain(this.stage)) as Stage;
    this.stage.onStart();
    return this.stage;
  }
}
