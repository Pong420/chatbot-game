'use client';
import { startTransition, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CharacterSelectorProps, CharacterSelector } from './CharacterSelector';

export interface SettingFormProps extends CharacterSelectorProps {
  isLineClient?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (formdata: FormData) => unknown;
}

export function SettingForm({ isLineClient, characters, onSubmit }: SettingFormProps) {
  const settings = [
    {
      id: 'customize_characters' as const,
      title: `自訂遊戲角色`,
      description: [
        `角色數量最少6個，最多12，其中最少2個好人和1個壞人，角色可以自由配搭，例如上可以 10狼 + 2女巫，但不保證沒有Bug，自定義角色後，參與人數必須和角色數量一樣才能開始遊戲`
      ],
      children: <CharacterSelector characters={characters} />
    },
    {
      id: 'werewolves_know_each_others' as const,
      title: `狼人知道誰是狼人`,
      description: [
        `開啟後，在狼人的回合，狼人可以知道其他狼人是誰，但每一回合只能選擇一個目標殺死，或者選擇平安夜，實際行動按小數服從多數，平票隨機選擇一個選項`,
        `因為技術限制，目前狼人只能自己拉個群組討論，所以這個設定有點雞肋，我最多也能建一個簡單的網頁聊天室，但麻煩`
      ]
    }
  ];

  const [isPending, setIsPending] = useState(false);

  return (
    <form
      className="max-w-screen-sm mx-auto p-4 h-screen flex flex-col"
      action={async formdata => {
        setIsPending(true);
        startTransition(async () => {
          await onSubmit(formdata);
          if (isLineClient) {
            const { liff } = await import('@line/liff');
            await liff.init({ liffId: process.env.NEXT_PUBLIC_LINE_WEREWOLF_LIFF_ID || '' });
            await liff.sendMessages([{ type: 'text', text: '狼人殺設定完畢' }]);
            liff.closeWindow();
          }
          setIsPending(false);
        });
      }}
    >
      <div className="flex flex-col gap-4">
        {settings.map(({ id, title, description, children }) => (
          <Card key={id} className="p-4">
            <div className="peer flex space-x-2">
              <Label htmlFor={id} className="flex flex-col space-y-2 cursor-pointer">
                <span>{title}</span>
                {description.map((content, i) => (
                  <span key={i} className="font-normal leading-snug text-muted-foreground">
                    {content}
                  </span>
                ))}
              </Label>

              <Switch id={id} name={id} className="m-auto" />
            </div>

            <div className="col-span-12 hidden peer-has-[:checked]:block">{children}</div>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-0 w-full mt-auto py-6">
        <Button className="w-full" size="lg" type="submit" disabled={isPending}>
          確認
        </Button>
      </div>
    </form>
  );
}
