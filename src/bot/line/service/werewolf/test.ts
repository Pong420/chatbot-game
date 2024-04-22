/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, vi } from 'vitest';
import { nanoid } from 'nanoid';
import { LineUser, createLineEventTestSuite } from '@line/test';
import { t as lt } from '@line/locales';
import { textMessage } from '@line/utils/createMessage';
import { characters } from '@werewolf/character';
import { Werewolf as Game } from '@werewolf/game';
import { Stage, VoteBaseStage } from '@werewolf/stage';
import { Character, Villager, Werewolf, Hunter, Guard, Predictor, Witcher } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { getGame } from '@/supabase/game';
import { default as handlers } from './handler';
import * as board from './board';

export const getPlayersByCharacter = <C extends LineUser>(game: Game, clients: C[]) =>
  Object.entries(characters).reduce(
    (res, [k, CharacterConstructor]) => ({
      ...res,
      [k.toLowerCase() + 's']: clients.filter(c => game.players.get(c.userId) instanceof CharacterConstructor)
    }),
    {} as Record<`${Lowercase<keyof typeof characters>}s`, C[]>
  );

export const { createLineUser, expectEvent } = createLineEventTestSuite(handlers);

export const groupId = nanoid();
export type WerewolfPlayer = ReturnType<typeof createLineUser>;

interface CreateGameOptions {
  numOfPlayers?: number;
  characters?: (typeof Character)[];
}

declare let game: Game;
declare let stage: Stage;
declare let survivors: WerewolfPlayer[];
declare let villagers: WerewolfPlayer[];
declare let werewolfs: WerewolfPlayer[];
declare let werewolf: WerewolfPlayer;
declare let hunters: WerewolfPlayer[];
declare let hunter: WerewolfPlayer;
declare let guards: WerewolfPlayer[];
declare let guard: WerewolfPlayer;
declare let predictors: WerewolfPlayer[];
declare let predictor: WerewolfPlayer;
declare let witchers: WerewolfPlayer[];
declare let witcher: WerewolfPlayer;
declare let players: WerewolfPlayer[];
declare let host: WerewolfPlayer;

export function testSuite() {
  vi.stubGlobal('game', undefined);
  vi.stubGlobal('stage', undefined);
  vi.stubGlobal('villagers', []);
  vi.stubGlobal('survivors', []);
  vi.stubGlobal('werewolfs', []);
  vi.stubGlobal('werewolf', undefined);
  vi.stubGlobal('hunters', []);
  vi.stubGlobal('hunter', undefined);
  vi.stubGlobal('guards', []);
  vi.stubGlobal('guard', undefined);
  vi.stubGlobal('predictors', []);
  vi.stubGlobal('predictor', undefined);
  vi.stubGlobal('witchers', []);
  vi.stubGlobal('witcher', undefined);
  vi.stubGlobal('players', []);
  vi.stubGlobal('host', undefined);

  const getPlayersByCharacter = (CharacterConstructor: typeof Character) =>
    players.filter(p => game.players.get(p.userId) instanceof CharacterConstructor);

  const update = async () => {
    const data = await getGame(players[0].groupId);
    game = Game.create(data!);
    stage = game.stage;

    survivors = game.stage.survivors.map(p => players.find(player => player.userId === p.id)!).filter(Boolean);
    villagers = getPlayersByCharacter(Villager);
    werewolfs = getPlayersByCharacter(Werewolf);
    hunters = getPlayersByCharacter(Hunter);
    hunter = hunters[0];
    guards = getPlayersByCharacter(Guard);
    guard = guards[0];
    predictors = getPlayersByCharacter(Predictor);
    predictor = predictors[0];
    witchers = getPlayersByCharacter(Witcher);
    witcher = witchers[0];
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const next = async (paylaod: any) => {
    const event = await host.gr(t(`Next`));

    await update();

    expect(event).toEqual(typeof paylaod === 'function' ? paylaod() : paylaod);
  };

  const createGame = async ({ numOfPlayers = 12, characters = [] }: CreateGameOptions = {}) => {
    players = Array.from({ length: numOfPlayers }, () => createLineUser({ groupId }));
    host = players[0];

    const dupClient = createLineUser({ name: players[0].name, groupId });
    const extraClient = createLineUser({ groupId });
    const clientInOthersGroup = createLineUser({ name: players[0].name });
    clientInOthersGroup.profile.userId = players[0].userId;

    await host.g(t(`Initiate`)).toEqual(board.start());
    await host.g(t(`Initiate`)).toEqual(textMessage(lt(`OtherGameRuning`, Game.type)));

    await host.g(t(`Join`)).toEqual(textMessage(t(`WaitFotHostSetup`)));

    await host.g(t(`Open`)).toMatchObject(board.players([]));

    await host.g(t('Join')).toMatchObject({ type: 'flex' });
    await host.g(t('Join')).toEqual(textMessage(t(`Joined`, host.name)));

    await dupClient.g(t('Join')).toEqual(textMessage(t('NicknameUsed', dupClient.name)));

    for (const client of players) {
      if (client === host) continue;
      await client.g(t('Join')).toMatchObject({ type: 'flex' });
      await client.g(t('Join')).toEqual(textMessage(t(`Joined`, client.name)));
    }

    await extraClient.g(t('Join')).toEqual(textMessage(t('GameIsFull', extraClient.name)));

    await clientInOthersGroup.g(t(`Initiate`)).toEqual(board.start());
    await clientInOthersGroup.g(t('Join')).toTextMessage(lt('JoinedOtherGroupsGame', clientInOthersGroup.name));
  };

  const allVoteTo = async (character: WerewolfPlayer) => {
    for (const survivor of survivors) {
      const event = await survivor.gr(t.regex(`Vote`, character.name));
      await update();
      expect(event).toMatchObject(board.vote(game.stage as VoteBaseStage));
    }
  };

  const allWaive = async () => {
    for (const survivor of survivors) {
      const event = await survivor.gr(t.regex(`Waive`));
      await update();
      expect(event).toMatchObject(board.vote(game.stage as VoteBaseStage));
    }
  };

  return { createGame, next, update, getPlayersByCharacter, allVoteTo, allWaive };
}
