import { PostgrestBuilder } from '@supabase/postgrest-js';
import { GameInstance } from '@/types';
import { supabase } from './supabase';
import { Tables, TablesInsert, TablesUpdate } from './database.types';

export type Game = Tables<'games'>;

export function getGame(groupId: string) {
  return supabase.from('games').select('*').eq('groupId', groupId).single().throwOnError();
}

export function createGame(data: TablesInsert<'games'>) {
  return supabase.from('games').insert([data]).select().single().throwOnError();
}

export function updateGame(
  ...payload: [groupId: string, data: TablesUpdate<'games'>] | [game: GameInstance]
): PostgrestBuilder<Tables<'games'>> {
  const [data, groupId] =
    typeof payload[0] === 'string' ? [payload[1], payload[0]] : [payload[0].serialize(), payload[0].groupId];
  return supabase.from('games').update(data).eq('groupId', groupId).select().single().throwOnError();
}
