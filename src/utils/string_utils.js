export function humanize(string) {
  return capitalize(string.split("_").join(" "));
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function interpolate(string, placeholders, delimeter) {
  let result = string;

  Object.keys(placeholders).forEach(key => {
    let placeholder = delimeter.start + key + delimeter.end;
    let value = placeholders[key];

    result = result.replace(placeholder, value);
  });

  return result;
}

export function isString(string) {
  return typeof string === "string";
}