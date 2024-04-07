import { supabase } from '@/utils/supabase';
import { Tables } from '@/utils/database.types';

export type User = Tables<'users'>;

export function getUser(userId: string) {
  return supabase.from('users').select('*').eq('userId', userId).single();
}

export function createUser(userId: string, nickname: string) {
  return supabase
    .from('users')
    .insert([{ userId, nickname, updated_at: new Date().toISOString() }])
    .select()
    .single();
}

export function updateUser(userId: string, data: Partial<User>) {
  return supabase.from('users').update(data).eq('userId', userId).select().single();
}
