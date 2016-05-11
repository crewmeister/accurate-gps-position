import {
  promiseThat,
  fulfilled,
  rejected,
  assertThat,
  equalTo,
} from 'hamjest';

import { accurateCurrentPosition, _accurateCurrentPosition } from './index';

const successfulPosition = () =>
  accurateCurrentPosition();

const noop = () => {};

global.navigator = {geolocation: {
  watchPosition: noop,
  clearWatch: noop,
}};

describe('`accurateCurrentPosition()`', () => {
  it('returns a promise', () => {
    navigator.geolocation.watchPosition = (onSuccess, _, {}) => {
      onSuccess({ coords: { accuracy: 1 } });
      onSuccess({ coords: { accuracy: 1 } });
    };
    
    return promiseThat(successfulPosition(), fulfilled())
  });

  // the promise way
  it('errors out when underlying GPS (`watchPosition()` fails)', () => {
    navigator.geolocation.watchPosition = (_, onError) => {
      onError(Error('Damn'));
    };
    
    return promiseThat(
      accurateCurrentPosition({}),
      rejected()
    );
  });
  
});