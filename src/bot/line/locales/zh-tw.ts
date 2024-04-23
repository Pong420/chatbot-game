import { defineMessages } from '@/utils/locale';

export const Commands = {
  GroupId: 'Group ID',
  GetUserId: 'My User ID',

  NickNameIntro: '暱稱系統介紹',
  MyNickName: '我的暱稱',
  SetNickName: '^/我的暱稱 (.*)'
};

export const Replies = {
  SystemError: '系統錯誤',

  GroupIdResp: 'The group id is {0}',
  GetUserIdResp: 'Your user id is {0}',
  GetUserIdFailed: '無法取得UserId',

  NickNameMaxLength: '暱稱不能多於{0}',
  NickNameEmpty: '暱稱不能為空',
  NickNameContainBracket: '暱稱不能擁有 "「 " 和 " 」"',
  NickNameUsing: '你已經在使用「{0}」',
  NickNameFailed: '設定暱稱失敗，請嘗試別的暱稱或聯絡管理員',
  NickNameSuccess: '暱稱設定成功',
  NickNameIntroResp: `
    暱稱只會在機器人相關回覆中顯示，例如遊戲期間
    如你未設定暱稱，使用機器人「部份」功能時，會記錄你LINE的暱稱，你修改LINE的暱稱後不會自動更新
    輸入「{0} 新的暱稱」可以新增或修改暱稱，最多{1}個字
    輸入「{0}」可以查詢你目前的暱稱，
    如果暱稱顯示「???」請稍後再試，本機器人也愛莫能助...
  `,

  JoinedOtherGroupsGame: `{0}已參加了其他群組的遊戲`,
  OtherGameRuning: '{0}進行中，請先結束遊戲',

  ForceQuitGame: `強制退出遊戲`,
  ForceQuitGameSucess: `好`
};

// eslint-disable-next-line import/no-anonymous-default-export
export default defineMessages(Commands, Replies);
