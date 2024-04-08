import { test, expect } from 'vitest';
import { Game } from './game';
import { Character, Villager, Werewolf } from './character';
import { Init, Start, Night, Daytime, Stage, End, stages } from './stage';
import { t } from './locales';
import { Voted } from './death';

let game: Game = Game.create({ groupId: '1' });
let stage: Stage = game.stage;
let survivors: Character[] = [];
let werewolfs: Werewolf[] = [];
let villagers: Villager[] = [];

const testSerialisation = () => {
  const serialized = game.serialize();
  expect(serialized.data).not.toHaveProperty('survivors');

  let newGame = Game.create(serialized);
  newGame = Game.create(serialized); // this check serialized is not updated

  // make sure the stage.name is not renamed
  const StageConstructor = stages[game.stage.name as keyof typeof stages];
  expect(Object.prototype.isPrototypeOf.call(Stage, StageConstructor)).toBeTruthy();

  newGame.players.forEach(player => {
    expect(player.constructor).not.toEqual(Character);
    expect(player).toBeInstanceOf(Character);
    expect(player).toStrictEqual(game.players.get(player.id)!);
  });

  expect(newGame.stage.survivors).toHaveLength(game.stage.survivors.length);
  expect(Object.keys(newGame.stage.playersByName)).toHaveLength(game.stage.players.size);
  expect(game.stage).toStrictEqual(newGame.stage);
};

const next = (StageConstructor: typeof Stage) => {
  stage = game.next();
  testSerialisation();
  expect(stage).toBeInstanceOf(StageConstructor);

  survivors = game.stage.survivors;
  werewolfs = game.getCharacters(Werewolf);
  villagers = game.getCharacters(Villager);
};

const createGame = ({ numOfPlayers = 13 } = {}) => {
  game = Game.create({ groupId: '1' });
  stage = game.stage;

  expect(stage).toBeInstanceOf(Init);
  testSerialisation();

  next(Start);
  expect(() => game.next()).toThrowError(t('NoEnoughPlayers'));

  for (let i = 0; i < numOfPlayers; i++) {
    const name = `player_${i}`;
    const join = () => (stage as Start).join({ id: `${i}`, nickname: `player_${i}` });

    if (i >= 12) {
      expect(join).toThrowError(t('GameIsFull', name)); // full
    } else {
      join();
      expect(join).toThrowError(t('Joined', name)); // duplicated join
    }
  }
  expect(game.players.size).toEqual(Math.min(numOfPlayers, 12));
};

test('flow', () => {
  createGame({ numOfPlayers: 6 });
  expect(game.players.size).toBe(6);

  next(Night);
  expect(stage.turn).toBe(1);
  expect(werewolfs.length).toBeGreaterThanOrEqual(1);
  expect(villagers.length).toBeGreaterThanOrEqual(1);
  expect(() => game.next()).toThrowError(t('StageNotEnded'));

  werewolfs[0].kill(villagers[0]);
  werewolfs.forEach(w => !w.endTurn && w.idle());
  expect(() => werewolfs[0].kill(villagers[0])).toThrowError(t(`TurnEnded`));

  expect(() => werewolfs[0].vote(villagers[0])).toThrowError(t('VoteNotStarted'));

  // --------------------------------------------------------------------------------

  // test vote and vote to self
  next(Daytime);
  expect(survivors).toHaveLength(stage.players.size - 1);
  expect(survivors).not.toContainEqual(villagers[0]);
  expect(() => werewolfs[0].kill(villagers[1])).toThrowError(t('NotYourTurn'));

  let daytime = stage as Daytime;
  expect(() => villagers[0].vote(villagers[0])).toThrowError(t('YouDead'));
  expect(() => villagers[0].vote(villagers[1])).toThrowError(t('YouDead'));
  expect(() => villagers[2].vote(villagers[0])).toThrowError(t('TargetIsDead', villagers[0].nickname));

  villagers[1].vote(werewolfs[0]);
  werewolfs[0].vote(villagers[1]);

  expect(() => game.next()).toThrowError(t('StageNotEnded'));
  survivors.forEach(survivor => {
    if (survivor.endTurn) return;
    expect(survivor.vote(survivor)).toMatchObject({ self: true });
  });
  survivors.forEach(survivor => {
    expect(daytime.candidates.get(survivor.id)).toHaveLength(1);
  });
  expect(daytime.countResults()).toMatchObject({ numberOfVotes: survivors.length, count: 1 });

  // --------------------------------------------------------------------------------

  // everyone gets one vote in previous round, so vote again
  for (let i = 0; i < 10; i++) {
    next(Daytime);
    daytime = stage as Daytime;

    if (i === 0) {
      expect(daytime.candidates.size).toBe(survivors.length);
    } else {
      expect(daytime.candidates.size).toBe(2);
    }

    expect(() => game.next()).toThrowError(t('StageNotEnded'));
    expect(() => villagers[2].vote(villagers[0])).toThrowError(t('TargetIsDead', villagers[0].nickname)); // expecet not to VoteOutOfRange

    villagers[1].vote(werewolfs[0]);
    werewolfs[0].vote(villagers[1]);
    survivors.forEach(survivor => !survivor.endTurn && survivor.waive());

    expect(daytime.countResults()).toMatchObject({ numberOfVotes: 2, count: 1 });
  }

  // --------------------------------------------------------------------------------

  // two players gets one vote, others player wavied, so vote again
  next(Daytime);
  daytime = stage as Daytime;
  survivors.forEach(survivor => (survivor.id === villagers[1].id ? survivor.waive() : survivor.vote(villagers[1])));

  expect(daytime.countResults()).toMatchObject({ numberOfVotes: survivors.length - 1, count: survivors.length - 1 });

  // --------------------------------------------------------------------------------

  // villagers[1] is dead by voting

  next(Night);
  expect(villagers[1].causeOfDeath[0]).toBeInstanceOf(Voted);
  expect(villagers[1].causeOfDeath[0] as Voted).toHaveProperty('total', survivors.length);
  expect(survivors).toHaveLength(stage.players.size - 2);

  expect(() => werewolfs[0].kill(villagers[1])).toThrowError(t('TargetIsDead', villagers[1].nickname)); // expecet not to VoteOutOfRange
  werewolfs[0].kill(villagers[2]);

  // --------------------------------------------------------------------------------

  // villagers[2] is killed by werewolf

  next(Daytime);
  expect(survivors).toHaveLength(3);
  werewolfs[0].vote(villagers[3]);
  villagers[4].vote(villagers[3]);
  villagers[3].vote(werewolfs[0]);

  // --------------------------------------------------------------------------------

  next(End);
});
