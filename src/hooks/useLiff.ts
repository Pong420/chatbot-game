import { useState, useEffect } from 'react';
import liff from '@line/liff';

export function useLiff() {
  const [liffObject, setLiffObject] = useState<typeof liff>();
  const [liffError, setLiffError] = useState<unknown>(null);

  useEffect(() => {
    liff
      .init({ liffId: `2004734407-Z0rbMV6D` })
      .then(() => {
        setLiffObject(liff);
      })
      .catch(setLiffError);
  }, []);

  return { liff: liffObject, error: liffError };
}
