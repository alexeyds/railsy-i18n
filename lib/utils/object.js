module.exports = { removeKeys };

function removeKeys(object, keys) {
  let result = {};

  for (let key in object) {
    if (!keys.includes(key)) {
      result[key] = object[key];
    }
  }

  return result;
}