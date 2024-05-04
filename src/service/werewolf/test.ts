/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, vi } from 'vitest';
import { Constructable } from '@/types';
import { Game } from './game';
import { Character, Guard, Hunter, Predictor, Villager, Werewolf, Witcher } from './character';
import { Init, Start, Stage, stages, Stages } from './stage';
import { GameSettingOption } from './game';
import { t } from './locales';

interface CreateGameOptions extends GameSettingOption {
  numOfPlayers?: number;
}

declare let game: Game;
declare let stage: Stage;
declare let survivors: Character[];
declare let werewolfs: Werewolf[];
declare let villagers: Villager[];
declare let hunters: Hunter[];
declare let hunter: Hunter;
declare let guards: Guard[];
declare let guard: Guard;
declare let predictors: Predictor[];
declare let predictor: Predictor;
declare let witchers: Witcher[];
declare let witcher: Witcher;

export function testSuite() {
  vi.stubGlobal('game', undefined);
  vi.stubGlobal('stage', undefined);
  vi.stubGlobal('survivors', []);
  vi.stubGlobal('werewolfs', []);
  vi.stubGlobal('villagers', []);
  vi.stubGlobal('hunters', []);
  vi.stubGlobal('hunter', undefined);
  vi.stubGlobal('guards', []);
  vi.stubGlobal('guard', undefined);
  vi.stubGlobal('predictors', []);
  vi.stubGlobal('predictor', undefined);
  vi.stubGlobal('witchers', []);
  vi.stubGlobal('witcher', undefined);

  const testSerialisation = () => {
    const serialized = game.serialize();
    expect(serialized.stage).not.toHaveProperty('survivors');

    let newGame = Game.create({ data: serialized });
    newGame = Game.create({ data: serialized }); // this check serialized is not updated
    newGame = Game.create({ data: JSON.parse(JSON.stringify(serialized)) });

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

  const next = <S extends Stage>(StageConstructor: Constructable<S>) => {
    stage = game.next();
    testSerialisation();
    expect(stage).toBeInstanceOf(StageConstructor);

    survivors = game.stage.survivors;
    werewolfs = game.getPlayersByCharacter(Werewolf);
    villagers = game.getPlayersByCharacter(Villager);
    hunters = game.getPlayersByCharacter(Hunter);
    hunter = hunters[0];
    guards = game.getPlayersByCharacter(Guard);
    guard = guards[0];
    predictors = game.getPlayersByCharacter(Predictor);
    predictor = predictors[0];
    witchers = game.getPlayersByCharacter(Witcher);
    witcher = witchers[0];

    return stage as S;
  };

  const nextStage = <K extends keyof Stages>(key: K) => {
    return next(stages[key] as Stages[K]);
  };

  const createGame = ({ customCharacters, numOfPlayers }: CreateGameOptions) => {
    game = Game.create({ data: { groupId: '1' } });
    stage = game.stage;

    if (customCharacters) {
      game.customCharacters = customCharacters;
    }

    expect(stage).toBeInstanceOf(Init);

    testSerialisation();

    next(Start);

    numOfPlayers = customCharacters?.length || numOfPlayers || 6;

    expect(() => game.next()).toThrowError(
      t('NoEnoughPlayers', customCharacters?.length ? customCharacters?.length : 6)
    );

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

  const allVoteTo = (character: Character) => {
    survivors.forEach(survivor => {
      if (survivor.endTurn) return;
      survivor.id === character.id ? survivor.waive() : survivor.vote(character);
    });
  };

  const allWaive = () => {
    survivors.forEach(survivor => !survivor.endTurn && survivor.waive());
  };

  return {
    createGame,
    testSerialisation,
    next,
    nextStage,
    allVoteTo,
    allWaive
  };
}
