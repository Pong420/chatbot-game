import { Exclude, Transform, TransformationType, instanceToPlain, plainToInstance } from 'class-transformer';
import { Character, characters } from '../character';
import { t } from '../locales';

const characterMap: Record<string, typeof Character> = {};

for (const k in characters) {
  const constructor = characters[k as keyof typeof characters];
  if (Object.prototype.isPrototypeOf.call(Character, constructor)) {
    characterMap[k] = constructor;
  }
}

export class Stage {
  readonly name: string;

  host: string; // host userId

  turn = 0;

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

  next(): typeof Stage {
    throw t('SystemError');
  }

  onStart() {
    this.init();
  }

  onEnd() {
    this._survivors = [];
    this.players.forEach(player => {
      player.isDead = player.causeOfDeath.length > 0;
      !player.isDead && this._survivors.push(player.id);
    });
  }
}
