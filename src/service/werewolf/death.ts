import { DiscriminatorDescriptor } from 'class-transformer';

export class Death {
  static readonly type: string;
}

export class Killed extends Death {
  type = 'Killed';
  userId: string;
}

export class Poisoned extends Killed {
  type = 'Poisoned';
}

export class Voting extends Death {
  type = 'Voting';

  votes: string[] = [];
  total: number;

  get percetage() {
    return Math.round((this.votes.length / this.total) * 100);
  }
}

export type CauseOfDeath = InstanceType<(typeof death)[keyof typeof death]>;

const death = {
  Killed,
  Poisoned,
  Voting
};

export const deathSubTypes: DiscriminatorDescriptor['subTypes'] = [];

for (const k in death) {
  const value = death[k as keyof typeof death];
  deathSubTypes.push({ name: k, value });
}
