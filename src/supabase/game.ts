import { supabase } from './supabase';
import { Tables, TablesInsert, TablesUpdate } from './database.types';

export type Game = Tables<'games'>;

export function getGame(groupId: string) {
  return supabase.from('games').select('*').eq('groupId', groupId).single();
}

export function createGame(data: TablesInsert<'games'>) {
  return supabase.from('games').insert([data]).select().single();
}

export function updateGame(groupId: string, data: TablesUpdate<'games'>) {
  return supabase.from('games').update(data).eq('groupId', groupId).select().single();
}
