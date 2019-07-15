export function accessNestedProperty(object, keys) {
  let nextObject = object;
  let success = true;
  let stepsTaken = [];

  for (let key of keys) {
    if (typeof nextObject === "object" && nextObject.hasOwnProperty(key)) {
      nextObject = nextObject[key];
      stepsTaken.push(key);
    } else {
      success = false;
      break;
    }
  }

  if (success) {
    return { success, stepsTaken, value: nextObject };
  } else {
    return { success, stepsTaken };
  }
}

export function getValueByKeys(object, keys) {
  if (Array.isArray(keys)) {
    let result;

    for (let key of keys) {
      if (object.hasOwnProperty(key)) { 
        result = object[key];
        break; 
      }
    }

    return result;
  } else {
    return object[keys];
  }
}