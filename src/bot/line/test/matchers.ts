/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'vitest';
import { MatchersObject } from '@vitest/expect';
import { textMessage } from '@line/utils/createMessage';

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => any ? P : [];

type CustomMatchers<R = unknown> = {
  [K in keyof typeof matchers]: (...args: OmitFirstArg<(typeof matchers)[K]>) => R;
};

const matchers = {
  toTextMessage(received, expected) {
    const { printExpected } = this.utils;

    expected = textMessage(expected);

    return {
      actual: received,
      expected: expected,
      pass: this.equals(received, expected),
      message: () =>
        this.isNot
          ? `Expected value to not equals\n${printExpected(expected)}`
          : `Expected value to equals\n${printExpected(expected)}`
    };
  }
} satisfies MatchersObject;

expect.extend(matchers);
