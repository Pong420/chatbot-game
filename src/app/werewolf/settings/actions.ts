'use server';

import { notFound, redirect, permanentRedirect, RedirectType } from 'next/navigation';
import { Werewolf } from '@werewolf/game';
import { getGame, updateGame } from '@/supabase/game';

export async function updateSettings(id: string, formatdata: FormData) {
  try {
    await new Promise(resolve => setTimeout(resolve, 0));

    // const data = await getGame(id).catch(() => null);
    // if (!data) return notFound();
    // if (data.type !== Werewolf.type) return notFound();
    // const game = Werewolf.create(data);
    // game.stage.numOfPlayers = 12;
    // await updateGame(game);
  } catch (error) {
    // TODO:
    console.log(error);
  }
}
