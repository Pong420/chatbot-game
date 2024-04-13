import { Exclude, Transform, TransformationType, instanceToPlain, plainToInstance } from 'class-transformer';
import { Constructable } from '@/types';
import { Character, characters } from '../character';

const characterMap: Record<string, typeof Character> = {};
const characterNameMap = new Map<typeof Character, string>();

for (const k in characters) {
  const constructor = characters[k as keyof typeof characters];
  if (Object.prototype.isPrototypeOf.call(Character, constructor)) {
    characterMap[k] = constructor;
    characterNameMap.set(constructor, k);
  }
}

export class Stage {
  readonly name: string;

  host: string; // host userId

  turn = 0;

  numOfPlayers: number | 'flexible' = 'flexible';

  @Transform(({ value, type }) => {
    return type === TransformationType.CLASS_TO_PLAIN
      ? value.map((constructor: typeof Character) => characterNameMap.get(constructor))
      : value.map((name: string) => characterMap[name]);
  })
  characters: (typeof Character)[] = [];

  @Transform(({ value, options, type }) => {
    return type === TransformationType.CLASS_TO_PLAIN
      ? Array.from(value, ([id, character]) => [id, instanceToPlain(character, options)])
      : new Map(
          value.map(([id, character]: [string, Character]) => {
            const CharacterConstructor = characterMap[character.type] || Character;
            const player = plainToInstance(CharacterConstructor, character, options);
            return [id, player];
          })
        );
  })
  players = new Map<string, Character>();

  @Exclude()
  playersByName: Record<string, Character> = {};

  _survivors: string[] = [];

  @Exclude()
  get survivors() {
    return this._survivors.map(id => this.players.get(id)!);
  }

  @Exclude()
  get nearDeath() {
    return this.survivors.filter(s => !!s.causeOfDeath.length);
  }

  init() {
    this.players.forEach(player => {
      player.stage = this;
      this.playersByName[player.nickname] = player;
    });
  }

  ended() {
    let endTurn = true;
    this.survivors.forEach(player => {
      endTurn = !player.endTurn ? false : endTurn;
    });
    return endTurn;
  }

  getPlayersByCharacter<C extends Character>(
    CharacterConstructor: Constructable<C>,
    from: Array<Character> | Map<string, Character> = this.players
  ) {
    const targets: C[] = [];
    from.forEach(c => {
      if (c instanceof CharacterConstructor) {
        targets.push(c as C);
      }
    });
    return targets;
  }

  /**
   * Since players could be rescued, we cannot update survivors on each stage
   */
  updateSurvivors() {
    this._survivors = [];
    this.players.forEach(player => {
      player.isDead = player.causeOfDeath.length > 0;
      !player.isDead && this._survivors.push(player.id);
    });
  }

  next(): typeof Stage {
    throw "next stage haven't defined";
  }

  onStart() {
    this.init();
  }

  onEnd() {}
}
