import { Type, DiscriminatorDescriptor, plainToInstance, instanceToPlain } from 'class-transformer';
import { Init, Stage, stages } from './stage';
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
    const targets: InstanceType<C>[] = [];
    this.players.forEach(c => {
      if (c instanceof CharacterContructor) {
        targets.push(c as InstanceType<C>);
      }
    });
    return targets;
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
