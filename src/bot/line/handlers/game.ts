import { t } from '@line/locales';
import { createHandler } from '@line/handler';
import { MemberLeft, Single, TextEqual, UserId } from '@line/filter';
import { updateUser } from '@service/game';

export default [
  createHandler(Single, TextEqual(t(`ForceQuitGame`)), UserId, async userId => {
    await updateUser(userId, { game: null });
    return t(`ForceQuitGameSucess`);
  }),
  createHandler(MemberLeft, UserId, async (_event, userId) => {
    await updateUser(userId, { game: null }).catch(() => void 0);
  })
];
