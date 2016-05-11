import {
  promiseThat,
  fulfilled,
  isFulfilledWith,
  rejected,
  assertThat,
  equalTo,
  hasProperty,
} from 'hamjest';

import { accurateCurrentPosition } from './index';

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
    const desiredAccuracy = 42;
    navigator.geolocation.watchPosition = (onSuccess, _, {}) => {
      onSuccess({ coords: { accuracy: 1000 } });
      onSuccess({ coords: { accuracy: 44 } });
      onSuccess({ coords: { accuracy: 43 } });
      onSuccess({ coords: { accuracy: desiredAccuracy } });
    };

    const options = { desiredAccuracy };
    return promiseThat(accurateCurrentPosition(options),
      isFulfilledWith({ coords: { accuracy: desiredAccuracy } })
    );
  });

  it('when desiredAccuracy does not occur within timeout, returns the LAST position', () => {
    const finalAccuracy = 42;
    const desiredAccuracy = finalAccuracy - 1;
    navigator.geolocation.watchPosition = (onSuccess, _, {}) => {
      onSuccess({ coords: { accuracy: 1000 } });
      onSuccess({ coords: { accuracy: 44 } });
      onSuccess({ coords: { accuracy: 43 } });
      onSuccess({ coords: { accuracy: finalAccuracy } });
    };

    const maxWait = 1;
    const options = { maxWait, desiredAccuracy };
    return promiseThat(accurateCurrentPosition(options),
      isFulfilledWith({ coords: { accuracy: finalAccuracy } })
    );
  });
  
});