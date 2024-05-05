'use server';

import { supabase } from '@service/supabase';
import { Tables } from './database.types';

export type Message = Tables<'chats'>;

export interface GetChatMessages {
  chat: string;
}

export interface CreateMessagePayload {
  chat: string;
  text: string;
  sender: string;
}

export async function createMessage({ chat, text, sender }: CreateMessagePayload) {
  return supabase.from('chats').insert({
    chat,
    text,
    sender
  });
}

export async function getMessages({ chat }: GetChatMessages) {
  return supabase.from('chats').select('*').eq('chat', chat);
}
