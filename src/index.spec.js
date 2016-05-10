import {
  promiseThat,
  fulfills
} from 'hamjest';

import { accurateCurrentPosition } from './index';

describe('`accurateCurrentPosition()`', () => {
  it('returns a promise', () => promiseThat(
    accurateCurrentPosition(), fulfills())
  );
  
});