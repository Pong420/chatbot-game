export class Death {
  static readonly type: string;
}

export class Killed extends Death {
  static readonly type = 'Killed';

  userId: string;
}

export class Voted extends Death {
  static readonly type = 'Voted';

  votes: string[] = [];
  total: number;

  get percetage() {
    return Math.round((this.votes.length / this.total) * 100);
  }
}

export type CauseOfDeath = InstanceType<(typeof types)[number]>;

const types = [Killed, Voted];
export const deathSubTypes = types.map(constructor => ({ value: constructor, name: constructor.type as string }));
