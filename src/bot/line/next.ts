import { Liff } from '@line/liff';

export async function checkIsLineClient() {
  const { headers } = await import('next/headers');
  return !!headers()
    .get('user-agent')
    ?.match(/Line\/\d+\.\d+\.\d+ LIFF/);
}

export type Profile = Awaited<ReturnType<Liff['getProfile']>>;

export async function getLiffProfile(): Promise<Profile> {
  const { liff } = await import('@line/liff');
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID || '';
  await liff.init({ liffId });
  const profile = await liff.getProfile();
  return profile;
}

export function getMockUserProfile(): Profile {
  const k = `LINE_DISPLAY_NAME`;
  let displayName = sessionStorage[k];
  if (!displayName) {
    displayName = 'Anonymous' + Math.round(Math.random() * 100);
    sessionStorage.setItem(k, displayName);
  }
  return { displayName, userId: displayName };
}

export async function getProfile() {
  if (process.env.NODE_ENV === 'production') {
    return await getLiffProfile();
  }
  return getMockUserProfile();
}
