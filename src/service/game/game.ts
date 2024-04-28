/* eslint-disable @typescript-eslint/no-explicit-any */
import { ERROR_CODE_EMPTY, supabase } from '@service/supabase';
import { Tables, TablesInsert, TablesUpdate } from '@service/database.types';

export type Game = Tables<'games'>;

export enum GameStatus {
  OPEN,
  CLOSE
}

export type CreateGameOptions = Partial<Game>;

export interface GameConstructor<G extends GameInstance> {
  type: string;
  create: (options: CreateGameOptions) => G;
  new (...args: any[]): G;
}

export abstract class GameInstance {
  id: number; // only defined with @service/game
  groupId: string;
  abstract serialize(): any;
}

type GameProps = Omit<Game, 'created_at' | 'data' | 'groupId' | 'id' | 'type' | 'updated_at'>;

export interface GetGameOptions {
  status?: GameStatus;
}

export async function getGame(id: string | number, options: GetGameOptions = {}) {
  try {
    let chain = supabase.from('games').select('*');

    if (typeof id === 'number') {
      chain = chain.eq('id', id);
    }

    if (typeof id === 'string') {
      chain = chain.eq('groupId', id);

      if (typeof options?.status === 'undefined') {
        options.status = GameStatus.OPEN;
      }
    }

    if (typeof options?.status !== 'undefined') {
      chain.eq('status', options.status);
    }

    const { data } = await chain.single().throwOnError();

    if (data) {
      Object.assign(data?.data as object, { id: data?.id });
    }

    return data;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === ERROR_CODE_EMPTY) {
      return null;
    }
    throw error;
  }
}

export async function createGame(data: TablesInsert<'games'>) {
  const resp = await supabase.from('games').insert([data]).select().single().throwOnError();
  Object.assign(resp.data?.data as object, { id: resp.data?.id });
  return resp.data;
}

export async function updateGame(
  ...payload:
    | [id: number, data: TablesUpdate<'games'>, props?: Partial<GameProps>]
    | [game: GameInstance, props?: Partial<GameProps>]
): Promise<Game | null> {
  const [data, id, props] =
    typeof payload[0] === 'number' || typeof payload[0] === 'undefined'
      ? [payload[1], payload[0], payload[2]]
      : [{ data: payload[0].serialize() }, payload[0].id, payload[1]];

  if (!id) {
    console.warn('updateGame: bad implemetation, id is ${id}');
    return null;
  }

  const resp = await supabase
    .from('games')
    .update({ ...data, ...props })
    .eq('id', id)
    .select()
    .single()
    .throwOnError();
  Object.assign(resp.data?.data as object, { id: resp.data?.id });
  return resp.data;
}
