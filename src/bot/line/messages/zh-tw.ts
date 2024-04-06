export const Commands = {
  GetGroupID: 'Group ID',
  GetUserID: 'My User ID'
};

export const Replies = {
  GetGroupIDResp: 'The group id is {0}',
  GetUserIDResp: 'Your user id is {0}'
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...Commands,
  ...Replies
};
