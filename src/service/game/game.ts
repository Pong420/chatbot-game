/* eslint-disable @typescript-eslint/no-explicit-any */
import { ERROR_CODE_EMPTY, supabase } from '@service/supabase';
import { Tables, TablesInsert, TablesUpdate } from '@service/database.types';

export type Game = Tables<'games'>;

export enum GameStatus {
  OPEN,
  CLOSE
}

export interface GameConstructor<G extends GameInstance> {
  type: string;
  create: (options: Record<string, any>) => G;
  new (...args: any[]): G;
}

export abstract class GameInstance {
  groupId: string;
  abstract serialize(): any;
}

type GameProps = Omit<Game, 'created_at' | 'data' | 'groupId' | 'id' | 'type' | 'updated_at'>;

export async function getGame(groupId: string) {
  try {
    const data = await supabase
      .from('games')
      .select('*')
      .eq('groupId', groupId)
      .single()
      .throwOnError()
      .then(resp => resp.data);
    return data;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === ERROR_CODE_EMPTY) {
      return null;
    }
    throw error;
  }
}

export async function createGame(data: TablesInsert<'games'>) {
  const resp = await supabase
    .from('games')
    .insert([{ ...data, status: GameStatus.OPEN }])
    .select()
    .single()
    .throwOnError();
  return resp.data;
}

export async function updateGame(
  ...payload:
    | [groupId: string, data: TablesUpdate<'games'>, props?: Partial<GameProps>]
    | [game: GameInstance, props?: Partial<GameProps>]
): Promise<Game | null> {
  const [data, groupId, props] =
    typeof payload[0] === 'string'
      ? [payload[1], payload[0], payload[2]]
      : [{ data: payload[0].serialize() }, payload[0].groupId, payload[1]];

  const updated = await supabase
    .from('games')
    .update({ ...data, ...props })
    .eq('groupId', groupId)
    .select()
    .single()
    .throwOnError()
    .then(resp => resp.data);
  return updated;
}
