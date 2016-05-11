(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var accurateCurrentPositionUsingCallbacks = exports.accurateCurrentPositionUsingCallbacks = function accurateCurrentPositionUsingCallbacks(geolocationSuccess, geolocationError, geoprogress, options) {
  var geolocation = navigator.geolocation;
  var lastCheckedPosition = void 0;
  var locationEventCount = 0;
  var watchID = void 0;
  var timerID = void 0;

  options = options || {};

  var checkLocation = function checkLocation(position) {
    lastCheckedPosition = position;
    locationEventCount = locationEventCount + 1;
    // We ignore the first event unless it's the only one received because some devices seem to send a cached
    // location even when maxaimumAge is set to zero
    if (position.coords.accuracy <= options.desiredAccuracy && locationEventCount > 1) {
      clearTimeout(timerID);
      geolocation.clearWatch(watchID);
      foundPosition(position);
    } else {
      geoprogress(position);
    }
  };

  var stopTrying = function stopTrying() {
    geolocation.clearWatch(watchID);
    foundPosition(lastCheckedPosition);
  };

  var onError = function onError(error) {
    clearTimeout(timerID);
    geolocation.clearWatch(watchID);
    geolocationError(error);
  };

  var foundPosition = function foundPosition(position) {
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

var accurateCurrentPosition = exports.accurateCurrentPosition = function accurateCurrentPosition(options) {
  return new Promise(function (resolve, reject) {
    var progress = function progress() {};
    accurateCurrentPositionUsingCallbacks(resolve, reject, progress, options);
  });
};

},{}]},{},[1]);
