export class Death {
  __type: string;

  constructor() {
    this['__type'] = this['constructor'].name;
  }
}

export class Killed extends Death {
  userId: string;
}

export class Voted extends Death {
  votes: string[] = [];
  total: number;

  get percetage() {
    return Math.round((this.votes.length / this.total) * 100);
  }
}

export type CauseOfDeath = InstanceType<(typeof types)[number]>;

const types = [Killed, Voted];
export const deathSubTypes = types.map(value => ({ value, name: value.name }));
