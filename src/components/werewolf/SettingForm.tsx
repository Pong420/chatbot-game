'use client';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLiffProfile } from '@line/next';
import type { GameSettingOption } from '@werewolf/game';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { createLocalStorage } from '@/utils/storage';
import { CharacterSelectorProps, CharacterSelector } from './CharacterSelector';

export interface SettingFormProps extends Pick<CharacterSelectorProps, 'characters'> {
  isLineClient?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (userId: string, values: SettingValues) => Promise<{ error?: string }>;
}

export type SettingValues = z.infer<typeof formSchema>;

const formSchema = z
  .object({
    autoMode: z.boolean().optional(),
    customCharacters: z.array(z.string()).optional(),
    werewolvesKnowEachOthers: z.boolean().optional()
  } satisfies Record<keyof GameSettingOption, unknown>)
  .extend({
    enableCustomCharacters: z.boolean().optional()
  });

const defaultValues: SettingValues = {
  autoMode: true,
  enableCustomCharacters: false,
  werewolvesKnowEachOthers: false
};

const storage = createLocalStorage('@werewolf/settings', defaultValues);

export function SettingForm({ isLineClient, characters, onSubmit }: SettingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [loaded, setLoaded] = useState(false);

  const form = useForm<SettingValues>({
    disabled: isPending,
    resolver: zodResolver(formSchema),
    defaultValues: { ...defaultValues }
  });

  const { watch, reset } = form;
  useEffect(() => {
    setLoaded(true);
    reset({ ...defaultValues, ...storage.get() });
    const subscription = watch(values => {
      storage.override(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, reset]);

  const handleSubmit = form.handleSubmit(({ ...formdata }) => {
    if (!formdata.enableCustomCharacters) {
      delete formdata['customCharacters'];
    }

    delete formdata['enableCustomCharacters'];

    startTransition(async () => {
      try {
        if (isLineClient) {
          const { liff } = await import('@line/liff');
          const { userId } = await getLiffProfile();
          const { error } = await onSubmit(userId, formdata);

          if (error) {
            toast(error);
            return;
          }

          await liff
            .sendMessages([{ type: 'text', text: '狼人殺設定完畢' }])
            .then(() => liff.closeWindow())
            .catch(() => {
              toast.error('發送訊息失敗，請關閉視窗並手動輸入【狼人殺設定完畢】以繼續遊戲');
            });
        }
      } catch (error) {
        toast.error(
          error && typeof error == 'object' && 'message' in error ? (error['message'] as string) : '發生錯誤'
        );
      }
    });
  });

  const settings = [
    {
      id: 'enableCustomCharacters',
      title: `自選遊戲角色`,
      description: [
        `角色數量最少6個，最多12，其中最少1個好人和1個壞人，角色可以自由配搭，例如可以 11狼人 + 1村民。已儘量考慮各種可能性，如有問題歡迎回報。`,
        `自定義角色後，參與人數必須和角色數量一樣才能開始遊戲。`
      ],
      children: (
        <FormField
          name="customCharacters"
          control={form.control}
          render={({ field: { ref, ...field } }) => <CharacterSelector characters={characters} {...field} />}
        />
      )
    },
    {
      id: 'autoMode',
      title: `自動模式`,
      description: [
        `開啟後，收到任何人發群組訊息都會進行查詢，如能進入下回合即會回覆，只要群組有人在聊天就可以。`,
        `希望帶節奏的主持人可以關閉，然後主動輸入【n】去查詢師是否等進入下一回合。`
      ]
    },
    {
      id: 'werewolvesKnowEachOthers',
      title: `狼人知道誰是狼人`,
      description: [
        `開啟後，在狼人的回合，機器人會回覆其他狼人的身份，但每一回合只能選擇一個目標殺死，或者選擇平安夜，實際行動按小數服從多數，平票隨機選擇一個選項。`
      ]
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] satisfies { [x: string]: any; id: keyof SettingValues }[];

  if (!loaded) return null;

  return (
    <form className="max-w-screen-sm mx-auto p-4 flex flex-col min-h-full" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        {settings.map(({ id, title, description, children }) => (
          <FormField
            key={id}
            name={id}
            control={form.control}
            render={({ field: { value, ...field } }) => (
              <Card className="p-4 group aria-disabled:opacity-50 select-none" aria-disabled={field.disabled}>
                <div className="flex space-x-2" aria-disabled={field.disabled}>
                  <Label
                    htmlFor={id}
                    className="flex flex-col space-y-2 cursor-pointer group-aria-disabled:cursor-not-allowed"
                    onClick={() => !field.disabled && form.setValue(id, !value)}
                  >
                    <span>{title}</span>
                    {description.map((content, i) => (
                      <span key={i} className="font-normal leading-snug text-muted-foreground">
                        {content}
                      </span>
                    ))}
                  </Label>

                  <Switch
                    className="m-auto"
                    {...field}
                    checked={value}
                    onCheckedChange={value => form.setValue(id, value)}
                  />
                </div>

                {value && children}
              </Card>
            )}
          />
        ))}
      </div>

      <div className="sticky bottom-0 w-full mt-auto py-4">
        <Button className="w-full" size="lg" type="submit" disabled={isPending}>
          確認
        </Button>
      </div>
    </form>
  );
}
