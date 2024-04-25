import { ERROR_CODE_EMPTY, supabase } from './supabase';
import { Tables, TablesInsert, TablesUpdate } from './database.types';

export type User = Tables<'users'>;

export async function getUser(userId: string) {
  try {
    return await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single()
      .throwOnError()
      .then(resp => resp.data);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === ERROR_CODE_EMPTY) {
      return null;
    }
    throw error;
  }
}

export async function createUser(data: TablesInsert<'users'>) {
  const resp = await supabase.from('users').insert([data]).select().single().throwOnError();
  return resp.data;
}

export async function updateUser(userId: string, data: TablesUpdate<'users'>) {
  const resp = await supabase.from('users').update(data).eq('userId', userId).select().single().throwOnError();
  return resp.data;
}
