import { t } from '@line/locales';
import { createHandler } from '@line/handler';
import { Single, UserId } from '@line/filter';
import { updateUser } from '@/supabase/user';

export const gameHandlers = [
  // TODO: handle memeber left
  createHandler(Single, UserId, async userId => {
    await updateUser(userId, { game: null });
    return t(`ForceQuitGameSucess`);
  })
];
