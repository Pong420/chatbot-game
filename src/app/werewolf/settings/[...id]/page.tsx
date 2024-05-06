import type { Metadata } from 'next';
import { redirect, RedirectType } from 'next/navigation';
import { checkIsLineClient } from '@line/next';
import { SettingForm } from '@/components/werewolf/SettingForm';
import { updateSettings } from '@service/actions/werewolf';
import { characters } from '@werewolf/utils';

export const metadata: Metadata = {
  title: `狼人殺設定`
};

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const onSubmit = updateSettings.bind(null, Number(id));
  const isLineClient = await checkIsLineClient();
  if (process.env.NODE_ENV === 'production' && !isLineClient) return redirect('/line', RedirectType.replace);
  return <SettingForm isLineClient={isLineClient} characters={characters} onSubmit={onSubmit} />;
}
