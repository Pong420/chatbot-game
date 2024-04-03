function replacer(key: PropertyKey, value: unknown) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()) // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key: PropertyKey, value: unknown) {
  if (typeof value === 'object' && value !== null) {
    if ('dataType' in value && 'value' in value && value['dataType'] === 'Map') {
      return new Map(value.value as []);
    }
  }
  return value;
}

export const stringify = (value: unknown) => JSON.stringify(value, replacer);
export const parse = (value: string) => JSON.parse(value, reviver);

export type Serialize<T> = {
  [K in keyof T]: NonNullable<T[K]> extends Map<infer KK, infer VV> ? [KK, VV][] : T[K];
};
