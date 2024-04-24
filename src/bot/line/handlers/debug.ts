import fs from 'fs/promises';
import path from 'path';
import { createHandler } from '@line/handler';
import { GroupId, TextEqual, TextMatch, UserId } from '@line/filter';
import { t } from '@line/locales';
import { outdir } from '@line/utils/saveMessages';

const debugHandlers = [
  createHandler(GroupId, TextEqual(t('GroupId')), groupId => t(`GroupIdResp`, groupId)),
  createHandler(UserId, TextEqual(t('GetUserId')), userId => t(`GetUserIdResp`, userId))
];

if (process.env.NODE_ENV === 'development') {
  debugHandlers.push(
    createHandler(TextMatch(/^\d+$/), async ([n]) => {
      const content = await fs.readFile(path.join(outdir, `${n}.json`), 'utf-8');
      return JSON.parse(content);
    })
  );
}

export default debugHandlers;
