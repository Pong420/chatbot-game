import { Button } from '@/components/ui/button';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export interface SettingsProps {
  onConfirm: () => void;
}

export function Settings({ onConfirm }: SettingsProps) {
  return (
    <div className="container px-0 h-screen flex flex-col">
      <CardHeader>
        <CardTitle>狼人殺設定</CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="option_1" className="flex flex-col space-y-1">
            <span>狼人知道誰是有狼人</span>
            <span className="font-normal leading-snug text-muted-foreground">
              開啟後，在狼人的回合，狼人可以知道其他狼人的是誰，但每一回合只能選擇一個目標殺死，或者選擇平安夜。因為技術問題，狼人只能自己拉個群組討論，實際行動是小數服從多數，平票隨機選擇一個選項，
            </span>
          </Label>
          <Switch id="option_1" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="functional" className="flex flex-col space-y-1">
            <span>自訂遊戲角色</span>
            <span className="font-normal leading-snug text-muted-foreground">
              角色數量上線12個，最少6個，其中最少2個好人和1個壞人，角色可以自由配搭，例如上可以 4狼 + 4獵人 +
              4女巫，但不保證沒有Bug，自定義角色後，參與人數必須和角色數量一樣才能開始遊戲
            </span>
          </Label>
          <Switch id="functional" />
        </div>
      </CardContent>

      <CardFooter className="sticky bottom-0 w-full mt-auto mb-0">
        <Button variant="outline" className="w-full" onClick={() => onConfirm()}>
          確認
        </Button>
      </CardFooter>
    </div>
  );
}
