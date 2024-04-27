import fs from 'fs/promises';
import path from 'path';
import { createHandler } from '@line/handler';
import { GroupId, TextEqual, TextMatch, UserId } from '@line/filter';
import { t } from '@line/locales';

const debugHandlers = [
  createHandler(GroupId, TextEqual(t('GroupId')), groupId => groupId),
  createHandler(UserId, TextEqual(t('GetUserId')), userId => userId)
];

if (process.env.NODE_ENV === 'development') {
  const { outdir } = await import('@line/utils/saveMessages');

  debugHandlers.push(
    createHandler(TextMatch(/^\d+$/), async ([n]) => {
      const content = await fs.readFile(path.join(outdir, `${n}.json`), 'utf-8');
      return JSON.parse(content);
    })
  );
}

export default debugHandlers;
