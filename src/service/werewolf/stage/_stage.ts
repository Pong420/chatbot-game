import { Exclude, Transform, TransformationType, instanceToPlain, plainToInstance } from 'class-transformer';
import { Constructable } from '@/types';
import { Character, characterMap, characterNameMap } from '../character';
import { type Game } from '../game';

export class Stage {
  static available?(stage: Stage): typeof Stage | undefined;

  readonly name: string;

  turn = 1;

  numOfPlayers = -1;

  @Exclude()
  game: Game;

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

  protected _survivors: string[] = [];

  @Exclude()
  get survivors() {
    return this._survivors.map(id => this.players.get(id)!);
  }

  /**
   * For display who death
   */
  protected _death: string[] = [];

  @Exclude()
  get death() {
    return this._death.map(id => this.players.get(id)!);
  }

  /**
   * For witcher know who being death
   */
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
    const _survivors = [...this._survivors];

    this._death = [];
    this._survivors = [];

    this.players.forEach(player => {
      player.isDead = player.causeOfDeath.length > 0;

      if (player.isDead) {
        _survivors.includes(player.id) && this._death.push(player.id);
      } else {
        this._survivors.push(player.id);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStart(stage: Stage) {
    this.init();
  }

  onEnd() {}
}
