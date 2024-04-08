/* eslint-disable @typescript-eslint/no-explicit-any */

// Refrences
// https://jest-extended.jestcommunity.dev/docs/getting-started/setup

import { expect } from 'vitest';
import * as matchers from 'jest-extended';

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining<T = any> extends CustomMatchers<T> {}
  // interface ExpectStatic extends CustomMatchers<any> {}
}

expect.extend(matchers);
