import { supabase } from './supabase';
import { Tables, TablesInsert, TablesUpdate } from './database.types';

export type User = Tables<'users'>;

export async function getUser(userId: string) {
  return await supabase.from('users').select('*').eq('userId', userId).single().throwOnError();
}

export async function createUser(data: TablesInsert<'users'>) {
  return await supabase.from('users').insert([data]).select().single().throwOnError();
}

export async function updateUser(userId: string, data: TablesUpdate<'users'>) {
  return await supabase.from('users').update(data).eq('userId', userId).select().single().throwOnError();
}
