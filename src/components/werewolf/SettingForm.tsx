'use client';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { GameSettingOption } from '@werewolf/stage';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/ui/form';
import { createLocalStorage } from '@/utils/storage';
import { CharacterSelectorProps, CharacterSelector } from './CharacterSelector';

export interface SettingFormProps extends Pick<CharacterSelectorProps, 'characters'> {
  isLineClient?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (userId: string, values: SettingValues) => Promise<{ message?: string }>;
}

export type SettingValues = z.infer<typeof formSchema>;

const formSchema = z
  .object({
    customCharacters: z.array(z.string()).optional(),
    werewolvesKnowEachOthers: z.boolean().optional()
  } satisfies Record<keyof GameSettingOption, unknown>)
  .extend({
    enableCustomCharacters: z.boolean().optional()
  });

const defaultValues: SettingValues = {
  enableCustomCharacters: false,
  werewolvesKnowEachOthers: false
};
const storage = createLocalStorage('@werewolf/settings', defaultValues);

export function SettingForm({ isLineClient, characters, onSubmit }: SettingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [loaded, setLoaded] = useState(false);

  const form = useForm<SettingValues>({
    disabled: isPending,
    resolver: zodResolver(formSchema),
    defaultValues: { ...defaultValues }
  });

  const { watch, reset } = form;
  useEffect(() => {
    setLoaded(true);
    reset(storage.get());
    const subscription = watch(values => {
      setError(undefined);
      storage.override(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, reset]);

  const handleSubmit = form.handleSubmit(async ({ ...formdata }) => {
    setError(undefined);

    const submit: typeof onSubmit = (...args) => onSubmit(...args).then(r => (r?.message ? Promise.reject(r) : r));

    if (!formdata.enableCustomCharacters) {
      delete formdata['customCharacters'];
    }

    delete formdata['enableCustomCharacters'];

    startTransition(async () => {
      try {
        if (isLineClient) {
          const { liff } = await import('@line/liff');
          const liffId = process.env.NEXT_PUBLIC_LIFF_ID || '';
          await liff.init({ liffId });
          const { userId } = await liff.getProfile();
          await submit(userId, formdata);
          await liff.sendMessages([{ type: 'text', text: '狼人殺設定完畢' }]);
          return liff.closeWindow();
        }
      } catch (error) {
        setError(error && typeof error == 'object' && 'message' in error ? (error['message'] as string) : undefined);
      }
    });
  });

  const settings = [
    {
      id: 'enableCustomCharacters',
      title: `自選遊戲角色`,
      description: [
        `角色數量最少6個，最多12，其中最少2個好人和1個壞人，角色可以自由配搭，例如上可以 10狼 + 2女巫，但不保證沒有Bug，自定義角色後，參與人數必須和角色數量一樣才能開始遊戲`
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
      id: 'werewolvesKnowEachOthers',
      title: `狼人知道誰是隊友 ( 未開放 )`,
      description: [
        `開啟後，在狼人的回合，狼人可以知道其他狼人是誰，但每一回合只能選擇一個目標殺死，或者選擇平安夜，實際行動按小數服從多數，平票隨機選擇一個選項`,
        `因為技術限制，目前狼人只能自己拉個群組討論，所以這個設定有點雞肋，我最多只能建一個簡單的網頁聊天室，但麻煩暫時不考慮`
      ],
      disabled: true
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] satisfies { [x: string]: any; id: keyof SettingValues }[];

  if (!loaded) return null;
  const _error = Object.values(form.formState.errors).filter(Boolean)[0] || error;

  return (
    <form className="max-w-screen-sm mx-auto p-4 flex flex-col" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        {!!_error && (
          <div className="bg-destructive text-destructive-foreground pt-3 p-4 rounded-md shadow-md">
            <div className="font-semibold">Error</div>
            <pre>
              <code className="text-sm whitespace-pre-wrap">
                {typeof _error === 'string' ? _error : JSON.stringify(_error, null, 2)}
              </code>
            </pre>
          </div>
        )}

        {settings.map(({ id, title, description, children, disabled }) => (
          <FormField
            key={id}
            name={id}
            disabled={disabled}
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
