import { t } from '@line/locales';
import { createHandler } from '@line/handler';
import { Single, TextEqual, UserId } from '@line/filter';
import { updateUser } from '@/supabase/user';

export default [
  // TODO: handle memeber left
  createHandler(Single, TextEqual(t(`ForceQuitGame`)), UserId, async userId => {
    await updateUser(userId, { game: null });
    return t(`ForceQuitGameSucess`);
  })
];
