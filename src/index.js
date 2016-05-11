export const _accurateCurrentPosition = (geolocationSuccess, geolocationError, geoprogress, options) => {
  const geolocation = navigator.geolocation;
  let lastCheckedPosition;
  let locationEventCount = 0;
  let watchID;
  let timerID;

  options = options || {};

  const checkLocation = (position) => {
    lastCheckedPosition = position;
    locationEventCount = locationEventCount + 1;
    // We ignore the first event unless it's the only one received because some devices seem to send a cached
    // location even when maxaimumAge is set to zero
    if ((position.coords.accuracy <= options.desiredAccuracy) && (locationEventCount > 1)) {
      clearTimeout(timerID);
      geolocation.clearWatch(watchID);
      foundPosition(position);
    } else {
      geoprogress(position);
    }
  };

  const stopTrying = () => {
    geolocation.clearWatch(watchID);
    foundPosition(lastCheckedPosition);
  };

  const onError = (error) => {
    clearTimeout(timerID);
    geolocation.clearWatch(watchID);
    geolocationError(error);
  };

  const foundPosition = (position) => {
    geolocationSuccess(position);
  };

  if (!options.maxWait) {
    options.maxWait = 10000;
  } // Default 10 seconds
  if (!options.desiredAccuracy) {
    options.desiredAccuracy = 20;
  } // Default 20 meters
  if (!options.timeout) {
    options.timeout = options.maxWait;
  } // Default to maxWait

  options.maximumAge = 0; // Force current locations only
  options.enableHighAccuracy = true; // Force high accuracy (otherwise, why are you using this function?)

  watchID = geolocation.watchPosition(checkLocation, onError, options);
  timerID = setTimeout(stopTrying, options.maxWait); // Set a timeout that will abandon the location loop
};

export const accurateCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    const geoprogress = () => {};
    _accurateCurrentPosition(resolve, reject, geoprogress, {});
  });  
};
