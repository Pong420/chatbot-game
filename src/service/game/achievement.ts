import { Tables, TablesUpdate } from '@service/database.types';
import { supabase } from '@service/supabase';

export type Achievement = Tables<'achievement'>;
export type AchievementUpdate = TablesUpdate<'achievement'>;

export async function updateAchivement<P extends Record<string, number>>(userId: string, payload: P) {
  const selector = Object.keys(payload).join(',') as '*';
  let { data: achievement } = await supabase.from('achievement').select(selector).eq('user_id', userId).single();

  if (achievement) {
    for (const k in payload) {
      const value = achievement[k as keyof typeof achievement] as number;
      achievement = { ...achievement, [k]: value + payload[k] };
    }
    await supabase.from('achievement').update(achievement).eq('user_id', userId);
  } else {
    await supabase.from('achievement').insert([{ user_id: userId, ...payload }]);
  }
}
