import { accurateCurrentPosition } from '../src/index';

var options = {
  maxWait: 10000,
  desiredAccuracy: 70,
};
document.getElementById('start').innerHTML = new Date() + '\nCalled with options:\n' + JSON.stringify(options, null, 4);

function stringifyObj(coords) {
  var obj = {};
  for (var key in coords) {
    obj[key] = coords[key];
  }
  return JSON.stringify(obj, null, 4);
}

function inProgress(pos) {
  document.getElementById('progress').innerHTML += new Date() + '\n' + stringifyObj(pos.coords) + '\n';
}

function onSuccess(pos) {
  document.getElementById('result').innerHTML = new Date() + '\n' + stringifyObj(pos.coords);
}

function onError(err) {
  document.getElementById('error').innerHTML = stringifyObj(err);
}
accurateCurrentPosition(onSuccess, onError, inProgress, options);
