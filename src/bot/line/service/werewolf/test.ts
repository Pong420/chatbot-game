/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, vi } from 'vitest';
import { nanoid } from 'nanoid';
import { LineUser, createLineEventTestSuite } from '@line/test';
import { t as lt } from '@line/locales';
import { textMessage } from '@line/utils/createMessage';
import { characters } from '@werewolf/character';
import { Werewolf as Game } from '@werewolf/game';
import { GameSettingOption, Stage } from '@werewolf/stage';
import { Character, Villager, Werewolf, Hunter, Guard, Predictor, Witcher } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { GameStatus, getGame, getUser, updateGame, User } from '@service/game';
import { getStageMessage } from './handlers/host';
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

interface CreateGameOptions extends GameSettingOption {
  numOfPlayers?: number;
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
    const data = await getGame(game?.id || groupId);
    if (!data?.data) throw `data not found be undefined`;
    game = Game.create(data);
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
  const hostGroupMessage = async (message: string, paylaod: any) => {
    const event = await host.gr(message);
    await update();
    expect(event).toEqual(typeof paylaod === 'function' ? paylaod() : paylaod);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const next = async (paylaod: any) => hostGroupMessage(t(`Next`), paylaod);

  const createGame = async ({ customCharacters, numOfPlayers }: CreateGameOptions = {}) => {
    numOfPlayers = numOfPlayers || customCharacters?.length || 12;

    vi.stubGlobal('game', undefined);
    vi.stubGlobal('stage', undefined);
    players = Array.from({ length: numOfPlayers }, () => createLineUser({ groupId }));
    host = players[0];

    const dupClient = createLineUser({ name: players[0].name, groupId });
    const clientInOthersGroup = createLineUser({ name: players[0].name });
    clientInOthersGroup.profile.userId = players[0].userId;

    await hostGroupMessage(t(`Initiate`), () => board.initiate(game.id));
    expect(game.host).toBe(host.userId);

    await update();
    game.stage.customCharacters = customCharacters;
    await updateGame(game);

    await host.g(t(`Join`)).toEqual(textMessage(t(`WaitFotHostSetup`)));

    await hostGroupMessage(t(`SetupCompleted`), () => board.settings(stage));

    await hostGroupMessage(t('Join'), () => board.players(stage));
    await host.g(t('Join')).toEqual(textMessage(t(`Joined`, host.name)));

    await dupClient.g(t('Join')).toEqual(textMessage(t('NicknameUsed', dupClient.name)));

    for (const client of players) {
      if (client === host) continue;
      const event = await client.gr(t('Join'));
      await update();
      expect(event).toEqual(board.players(stage));
      await client.g(t('Join')).toEqual(textMessage(t(`Joined`, client.name)));
    }

    await hostGroupMessage(t(`Start`), () => board.start(game));

    await clientInOthersGroup.g(t(`Initiate`)).toMatchObject({ type: 'flex' });
    await clientInOthersGroup.g(t('Join')).toTextMessage(lt('JoinedOtherGroupsGame', clientInOthersGroup.name));
    await clientInOthersGroup.gr(t('End'));
  };

  const allVoteTo = async (character: WerewolfPlayer) => {
    for (const survivor of survivors) {
      const event = await survivor.gr(t.regex(`Vote`, character.name));
      await update();
      expect(event).toEqual(board.vote(game));
    }
  };

  const allWaive = async () => {
    for (const survivor of survivors) {
      const event = await survivor.gr(t.regex(`Waive`));
      await update();
      expect(event).toEqual(board.vote(game));
    }
  };

  const ended = async () => {
    const data = await getGame(game.id);
    expect(data).toHaveProperty('status', GameStatus.CLOSE);
    expect(Promise.all(Array.from(game.players.keys(), userId => getUser(userId)))).resolves.toSatisfyAll(
      player => (player as User).game === null
    );
  };

  return { createGame, next, hostGroupMessage, update, getPlayersByCharacter, allVoteTo, allWaive, ended };
}
