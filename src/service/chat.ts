import { supabase } from '@service/supabase';
import { Tables, TablesInsert } from './database.types';

export type Chat = Tables<'chats'>;
export type Message = Tables<'chat_messages'>;
export type CreateMessage = TablesInsert<'chat_messages'>;

export async function createChat({ game }: { game: number }) {
  const { data, error } = await supabase.from('chats').insert({ game }).select().single();
  return { data, error };
}

export async function getChat({ chat }: { chat: string }) {
  return supabase.from('chats').select('*').eq('id', chat).single();
}

export async function createMessage(payload: CreateMessage) {
  return supabase.from('chat_messages').insert(payload).select();
}

export async function getMessages({ chat }: { chat: string }) {
  return supabase.from('chat_messages').select('*').eq('chat', chat);
}
