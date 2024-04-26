import type { Metadata } from 'next';
import { SettingForm } from '@/components/werewolf/SettingForm';
import { characters } from '@/app/werewolf/settings/utils';
import { updateSettings } from '../actions';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: `狼人殺設定`
};

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const onSubmit = updateSettings.bind(null, id);

  const headersList = headers();
  const isLineClient = !!headersList.get('user-agent')?.match(/Line\/\d+\.\d+\.\d+ LIFF/);

  return <SettingForm isLineClient={isLineClient} characters={characters} onSubmit={onSubmit} />;
}
