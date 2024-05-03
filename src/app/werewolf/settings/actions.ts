'use server';

import { z } from 'zod';
import { Init } from '@werewolf/stage';
import { type GameSettingOption, Werewolf } from '@werewolf/game';
import { CharacterKey } from '@werewolf/character';
import { GameStatus, getGame, updateGame } from '@service/game';
import { charactersMap } from './utils';

const schema = z.object({
  autoMode: z.boolean().optional(),
  customCharacters: z.array(z.string()).min(6).max(12).optional(),
  werewolvesKnowEachOthers: z.boolean().optional()
} satisfies Record<keyof GameSettingOption, unknown>);

export async function updateSettings(
  id: number,
  hostId: string,
  payload: z.infer<typeof schema>
): Promise<{ message?: string }> {
  const { customCharacters } = payload;

  try {
    const data = await getGame(id, { status: GameStatus.OPEN }).catch(() => null);

    if (!data || data.type !== Werewolf.type) return { message: `遊戲不存在` };
    const game = Werewolf.create(data);

    if (game.host !== hostId) return { message: `只有主持人可以進行設定` };
    if (!(game.stage instanceof Init)) return { message: `遊戲已開始，無法更改設定` };

    if (customCharacters?.length) {
      let bad = 0;
      let good = 0;

      for (const name of customCharacters) {
        const c = charactersMap[name as keyof typeof charactersMap];
        if (!c) continue;
        if (c.good) good += 1;
        else bad += 1;
      }

      if (good < 1) return { message: `最少要一個好人` };
      if (bad < 1) return { message: `最少要一個壞人` };
      if (customCharacters.length < 6) return { message: `角色數量不能小於「6」` };
      if (customCharacters.length > 12) return { message: `角色數量不能多於「12」` };
      game.customCharacters = customCharacters as CharacterKey[];
    }

    const r = schema.safeParse(payload);
    if (r.error) return { message: `Invalid Data` };

    Object.assign(game.stage, r.data);

    await updateGame(game);

    return {};
  } catch (error) {
    return { message: '設定失敗' };
  }
}
