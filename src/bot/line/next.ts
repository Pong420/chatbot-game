export async function checkIsLineClient() {
  const { headers } = await import('next/headers');
  return !!headers()
    .get('user-agent')
    ?.match(/Line\/\d+\.\d+\.\d+ LIFF/);
}
