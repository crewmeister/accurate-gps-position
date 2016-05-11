import {
  promiseThat,
  fulfilled,
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

  it('errors out when underlying GPS (`watchPosition()` fails)', () => {
    navigator.geolocation.watchPosition = (_, onError) => {
      onError(Error('Damn'));
    };
    
    const onError = () => {
      onError.wasCalled = true;
    };
    onError.wasCalled = false;
    
    _accurateCurrentPosition(noop, onError, {});
    
    assertThat(onError.wasCalled, equalTo(true));
  });
  
});