import { GameInstance } from '@/types';
import { ERROR_CODE_EMPTY, supabase } from './supabase';
import { Tables, TablesInsert, TablesUpdate } from './database.types';

export type Game = Tables<'games'>;

export enum GameStatus {
  OPEN,
  CLOSE
}
type GameProps = Omit<Game, 'created_at' | 'data' | 'groupId' | 'id' | 'type' | 'updated_at'>;

/**
 * memo for multiple Game filter
 */
const memo = new Map<string, Game | null>();

export async function getGame(groupId: string) {
  let data = memo.get(groupId);
  if (!data) {
    try {
      data = await supabase
        .from('games')
        .select('*')
        .eq('groupId', groupId)
        .eq('status', GameStatus.OPEN)
        .single()
        .throwOnError()
        .then(resp => resp.data);
      data && memo.set(groupId, data);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === ERROR_CODE_EMPTY) {
        return null;
      }
      throw error;
    }
  }
  return data;
}

export async function createGame(data: TablesInsert<'games'>) {
  const resp = await supabase.from('games').insert([data]).select().single().throwOnError();
  memo.set(data.groupId, resp.data);
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
      : [payload[0].serialize(), payload[0].groupId, payload[1]];

  const updated = await supabase
    .from('games')
    .update({ ...data, ...props })
    .eq('groupId', groupId)
    .select()
    .single()
    .throwOnError()
    .then(resp => resp.data);
  memo.set(groupId, updated);
  return updated;
}
