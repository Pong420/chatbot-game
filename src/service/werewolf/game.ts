import { Type, DiscriminatorDescriptor, plainToInstance, instanceToPlain } from 'class-transformer';
import { Pending, Stage, stages } from './stage';

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
  id: string;

  @Type(() => Stage, {
    discriminator: {
      property: '__type',
      subTypes
    }
  })
  stage: Stage = new Pending();

  get players() {
    return this.stage.players;
  }

  static create({ id, stage }: CreateGame) {
    return plainToInstance(Game, { id, stage }, { exposeUnsetFields: false });
  }

  serialize() {
    return instanceToPlain(this) as Game;
  }

  next() {
    const Stage = this.stage.next();
    this.stage.onEnd();
    this.stage = plainToInstance(Stage, instanceToPlain(this.stage)) as Stage;
    this.stage.onStart();
    return this.stage;
  }
}
