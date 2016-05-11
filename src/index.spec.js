import {
  promiseThat,
  fulfilled,
  isFulfilledWith,
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
    
    return promiseThat(successfulPosition(), fulfilled());
  });

  it('errors out when underlying GPS (`watchPosition()` fails)', () => {
    navigator.geolocation.watchPosition = (_, onError) => {
      onError(Error('Damn'));
    };
    
    return promiseThat(
      accurateCurrentPosition({}),
      rejected()
    );
  });

  it('returns when the desired accuracy was returned', () => {
    navigator.geolocation.watchPosition = (onSuccess, _, {}) => {
      onSuccess({ coords: { accuracy: 1000 } });
      onSuccess({ coords: { accuracy: 42 } });
    };

    const options = { desiredAccuracy: 42 };
    return promiseThat(accurateCurrentPosition(options),
      isFulfilledWith({ coords: { accuracy: 42 } })
    );
  });
  
});