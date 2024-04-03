import { Type, DiscriminatorDescriptor, Exclude, plainToInstance, instanceToPlain } from 'class-transformer';
import { Stage, Pending, stages } from './stage';

const subTypes: DiscriminatorDescriptor['subTypes'] = [];

for (const k in stages) {
  const value = stages[k as keyof typeof stages];
  if (Object.prototype.isPrototypeOf.call(Stage, value)) {
    subTypes.push({ name: value.name, value });
  }
}

export class Game {
  id: string;

  @Type(() => Stage, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'name',
      subTypes
    }
  })
  stage: Stage = new Pending();

  @Exclude()
  get players() {
    return this.stage.players;
  }

  constructor(initialState?: object) {
    Object.assign(this, { ...initialState });
  }

  next() {
    const Stage = this.stage.next();
    this.stage.onEnd();
    this.stage = plainToInstance(Stage, instanceToPlain(this.stage)) as Stage;
    this.stage.onStart();
    return this.stage;
  }
}
