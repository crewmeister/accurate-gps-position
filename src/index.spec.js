import {
  promiseThat,
  fulfilled
} from 'hamjest';

import { accurateCurrentPosition } from './index';

const successfulPosition = () =>
  accurateCurrentPosition();

describe('`accurateCurrentPosition()`', () => {
  it('returns a promise', () => promiseThat(
    successfulPosition(), fulfilled())
  );
  
});