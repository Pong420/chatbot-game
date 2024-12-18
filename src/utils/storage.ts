/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { JSONParse } from './JsonParse';
import { Get, ObjectKeyPaths } from '../types';

/**
 * Web storage utility
 *  - Type safe
 *  - Group all data into one field
 *  - Fallback to memory storage if browser not allow `localStorage` or `sessionStorage`
 *
 * ---- Basic Usage ----
 * 1. Extend `TypedStorage` interface, and add the new properties and it types
 * ```ts
 * declare global {
 *    interface TypedStorage {
 *      newField: string;
 *      // for object property, better use createLocalStorage('objectField', {}) instead
 *      objectField: Record<string, any>;
 *    }
 * }
 *
 * const value = rootLocalStorage.get('newField');
 * const value = rootLocalStorage.get('newField', 'defaultValue');
 * rootLocalStorage.set('newField', 'new value');
 * ```
 *
 * ---- Advanced Usage ----
 * 1.  Define a new schema interface
 * ```ts
 * interface NewObjectSchema {
 *   optional?: string
 *   required: string
 * }
 * ```
 *
 * 2.  Create a new storage
 * ```ts
 * export const newStorage = createLocalStorage<NewObjectSchema>('data-key', { required: '123' });
 * ```
 *
 * 3. Then use it
 * ```ts
 * const value = newStorage.get('optional');
 * const value = newStorage.get('optional', 'default value');
 * newStorage.set('required', 'new value');
 * ```
 */

declare global {
  interface TypedStorage {
    VERSION: string;
  }
}

export interface IStorage<T extends Record<string, any>> {
  key: string;
  get(): T;
  get<K extends ObjectKeyPaths<T>>(prop: K, fallback: Get<T, K>): Get<T, K>;
  get<K extends ObjectKeyPaths<T>>(prop: K): Get<T, K> extends undefined ? Get<T, K> | undefined : Get<T, K>;
  get<K extends ObjectKeyPaths<T>>(prop: K): Get<T, K> | undefined;
  get<K extends ObjectKeyPaths<T>>(prop?: K): T | Get<T, K>;

  set<K extends ObjectKeyPaths<T>>(prop: K, value: Get<T, K>): void;

  remove: <K extends keyof T = any>(key: K) => void;

  override(value: T): void;
  reset: () => void;

  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => T;
  emitChange: () => void;
}

type Action = 'set' | 'override' | 'remove' | 'reset';

interface CreateStorageUtilOptions {
  getInitialValues: <T extends Record<string, any>>(key: string, defaultValue?: T) => any;
  onChange?: (payload: { key: string; value: any; action: Action }) => void;
}

const isObjectOrArray = (payload: unknown): payload is Record<string, any> | any[] => {
  return typeof payload === 'object' && payload !== null;
};

export const get = <T extends Record<string, any>, Path extends ObjectKeyPaths<T>>(
  from: T,
  path: Path | string[],
  defaultValue?: Get<T, Path>
): Get<T, Path> | undefined => {
  const [key, ...selectors] = typeof path === 'string' ? path.match(/([^[.\]])+/g) || [] : path;

  if (!isObjectOrArray(from) || !key) return;

  if (selectors.length === 0) {
    return from[key] ?? defaultValue;
  }

  const empty = /^\d+$/.test(key) ? [] : {};
  const next = from[key as keyof typeof from] ?? empty;

  return get(next as T, selectors, defaultValue);
};

export const set = <T extends Record<string, any>, Path extends ObjectKeyPaths<T>>(
  from: T,
  path: Path | string[],
  value: Get<T, Path>
): T => {
  const [key, ...selectors] = typeof path === 'string' ? path.match(/([^[.\]])+/g) || [] : path;

  if (!isObjectOrArray(from) || !key) return from;

  if (selectors.length === 0) {
    return { ...from, [key]: value };
  }

  return { ...from, [key]: set((from[key] || {}) as T, selectors, value) };
};

const createStorageUtil = <T extends Record<string, any>>({ getInitialValues, onChange }: CreateStorageUtilOptions) => {
  return (key: string, defaultValue: T): IStorage<T> => {
    let value = getInitialValues(key, defaultValue) as T;
    let listeners: (() => void)[] = [];

    const emitChange = () => {
      for (const listener of listeners) {
        listener();
      }
    };

    return {
      key,
      get: ((prop, fallback) => {
        if (typeof prop === 'undefined') {
          return value;
        }

        if (isObjectOrArray(value)) {
          return get(value, prop, fallback ?? get(defaultValue, prop));
        }

        return value;
      }) as IStorage<T>['get'],
      set(prop, propValue) {
        value = set(value, prop, propValue);
        onChange?.({ key, value, action: 'set' });
        emitChange();
      },
      override(newValue) {
        value = newValue;
        onChange?.({ key, value, action: 'override' });
        emitChange();
      },
      remove(prop) {
        value = { ...value, [prop]: undefined };
        onChange?.({ key, value, action: 'remove' });
        emitChange();
      },
      reset: () => {
        value = { ...defaultValue };
        onChange?.({ key, value, action: 'reset' });
        emitChange();
      },
      emitChange,
      subscribe(listener) {
        listeners = [...listeners, listener];
        return () => {
          listeners = listeners.filter(l => l !== listener);
        };
      },
      getSnapshot: () => value
    };
  };
};

export const createMemoryStorage = createStorageUtil({
  getInitialValues: () => ({})
});

const createStorageFromWebStorage = (webStorage: globalThis.Storage) => {
  return createStorageUtil({
    getInitialValues: (key, defaultValue) => JSONParse(webStorage.getItem(key) || '', defaultValue),
    onChange: ({ key, value, action }) => {
      switch (action) {
        case 'set':
        case 'remove':
        case 'override':
          webStorage.setItem(key, JSON.stringify(value));
          break;
        case 'reset':
          webStorage.removeItem(key);
          break;
      }
    }
  });
};

export const createStorageFromStorage = (storage: IStorage<Record<string, unknown>>) => {
  return createStorageUtil({
    getInitialValues: (key, defaultValue) => storage.get(key, defaultValue),
    onChange: ({ key, value, action }) => {
      switch (action) {
        case 'set':
        case 'override':
        case 'remove':
          storage.set(key, value);
          break;
        case 'reset':
          storage.remove(key);
          break;
      }
    }
  });
};

export function webStorageSupport() {
  const key = 'TEST_STORAGE';
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, key);
      localStorage.removeItem(key);
      return true;
    }
  } catch (error) {
    //
  }

  return false;
}

const key = '@chatbot-game';
const initialValues: TypedStorage = { VERSION: 'v1' };

const createRootLocalStorage = webStorageSupport() ? createStorageFromWebStorage(localStorage) : createMemoryStorage;

const createRootSessionStorage = webStorageSupport()
  ? createStorageFromWebStorage(sessionStorage)
  : createMemoryStorage;

export const rootLocalStorage = createRootLocalStorage(key, initialValues);
export const rootSessionStorage = createRootSessionStorage(key, initialValues);

export const createLocalStorage = <T extends Record<string, any>>(key: string, defaultValue: T) =>
  createStorageFromStorage(rootLocalStorage)(key, defaultValue);

export const createSessionStorage = <T extends Record<string, any>>(key: string, defaultValue: T) =>
  createStorageFromStorage(rootSessionStorage)(key, defaultValue);
