import { Messages as WerewolfMessages } from '@/service/werewolf/messages';

export const Commands = {
  GET_GROUP_ID: 'Group ID',
  GET_USER_ID: 'My User ID'
};

export const Replies = {
  GET_GROUP_ID_RESP: 'The group id is {0}',
  GET_USER_ID_RESP: 'Your user id is {0}'
};

// eslint-disable-next-line import/no-anonymous-default-export
export const Messages = {
  ...Commands,
  ...Replies,
  ...WerewolfMessages
};
