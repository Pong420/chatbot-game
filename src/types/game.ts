/* eslint-disable @typescript-eslint/no-explicit-any */

export interface GameConstructor<G extends GameInstance> {
  type: string;
  create: (options: { groupId: string; data?: any }) => G;
  new (...args: any[]): G;
}

export abstract class GameInstance {
  groupId: string;
  abstract serialize(): any;
}
