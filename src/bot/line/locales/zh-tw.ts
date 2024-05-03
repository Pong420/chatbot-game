import { defineMessages } from '@/utils/locale';

export const Commands = {
  GroupId: 'Group ID',
  GetUserId: 'My User ID',

  NickNameIntro: '暱稱系統介紹',
  MyNickName: '我的暱稱',
  SetNickName: '^設定暱稱 (.*)'
};

export const Replies = {
  SystemError: '系統錯誤',
  GetUserIdFailed: '無法取得UserId',

  NickNameMaxLength: '暱稱不能多於{0}個字母，包括中英文',
  NickNameEmpty: '暱稱不能為空',
  NickNameContainBracket: '暱稱不能擁有 "【" 和 "】"',
  NickNameUsing: '你已經在使用【{0}】',
  NickNameFailed: '設定暱稱失敗，請嘗試別的暱稱或聯絡作者',
  NickNameSuccess: '設定成功，你是【{0}】',

  OtherGameRuning: '{0}進行中，請先結束遊戲',
  JoinedOtherGroupsGame: `{0}已參加了其他群組的遊戲`,
  ForceQuitGame: `強制退出遊戲`,
  ForceQuitGameSucess: `好`,

  TermOfUse: `使用條款`,
  Privacy: `隱私政策`,
  JoinGroupTitle: '溫馨提示',
  JoinGroupMessage: `
    嗨，感謝邀請，當您繼續使用本機器人時，即表示您已同意接受機器人的【使用條款】及【隱私政策】，
    如您不同意，立即停止使用
  `
};

// eslint-disable-next-line import/no-anonymous-default-export
export default defineMessages(Commands, Replies);
