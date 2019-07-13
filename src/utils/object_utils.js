export function removeKeys(object, keys) {
  let result = {};

  for (let key in object) {
    if (!keys.includes(key)) {
      result[key] = object[key];
    }
  }

  return result;
}

export function removeUndef(object) {
  let result = Object.assign({}, object);
  
  for (let key in object) {
    if (object[key] === undefined) {
      delete result[key];
    }
  }

  return result;
}