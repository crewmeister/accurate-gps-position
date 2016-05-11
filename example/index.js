import { accurateCurrentPositionUsingCallbacks } from '../src/index';

const options = {
  maxWait: 10000,
  desiredAccuracy: 70,
};
document.getElementById('start').innerHTML = `${new Date()}
Called with options:
${JSON.stringify(options, null, 4)}
`;

const stringifyObj = (coords) => {
  let obj = {};
  for (let key in coords) {
    obj[key] = coords[key];
  }
  return JSON.stringify(obj, null, 4);
};

const inProgress = (pos) => {
  document.getElementById('progress').innerHTML += new Date() + '\n' + stringifyObj(pos.coords) + '\n';
};

const onSuccess = (pos) => {
  document.getElementById('result').innerHTML = new Date() + '\n' + stringifyObj(pos.coords);
};

const onError = (err) => {
  document.getElementById('error').innerHTML = stringifyObj(err);
};

accurateCurrentPositionUsingCallbacks(onSuccess, onError, inProgress, options);
