import { createHandler } from '@line/handler';
import { JoinGroup, Single, TextEqual } from '@line/filter';
import { t } from '@line/locales';
import { createTableMessage, wrapAndCenterText, wrapedText } from '@line/utils/createTableMessage';
import { secondaryButton, uriAction } from '@line/utils/createMessage';

const host = `https://chatbot-games.vercel.app`;
const privacy = `${host}/privacy`;
const termOfUse = `${host}/term-of-use`;

export default [
  createHandler(Single, TextEqual(t('TermOfUse')), () => termOfUse),
  createHandler(Single, TextEqual(t('Privacy')), () => privacy),
  createHandler(JoinGroup, () =>
    createTableMessage({
      fillCol: 0,
      title: [wrapAndCenterText(t(`JoinGroupTitle`))],
      rows: t.paragraph('JoinGroupMessage').map(p => [wrapedText(p)]),
      buttons: [
        secondaryButton(uriAction(t(`TermOfUse`), termOfUse)),
        secondaryButton(uriAction(t(`Privacy`), privacy))
      ]
    })
  )
];
