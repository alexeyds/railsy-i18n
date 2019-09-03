export function presentFunctionCall(func, ...args) {
  let presentedArgs = presentArgs(args);
  return `${func}(${presentedArgs})`;
}

function presentArgs(args) {
  if (args.length === 0) {
    return "";
  } else {
    return args.map(a => presentValue(a)).join(", ");
  }
}

function presentValue(value) {
  switch(typeof value) {
    case 'string': {
      return `"${value}"`;
    }
    case "undefined": {
      return "undefined";
    }
    case "object": {
      return presentPlainObject(value);
    }
    default: {
      return value;
    }
  }
}

function presentPlainObject(obj) {
  if (obj === null) {
    return "null";
  } else if (Array.isArray(obj)) {
    let presentedArray = obj.map(i => presentValue(i));

    return "[" + presentedArray.join(", ") + "]";
  } else {
    let result = [];

    for (let [key, value] of Object.entries(obj)) {
      let presentedEntry = `${key}: ${presentValue(value)}`;
      result.push(presentedEntry);
    }

    let leftBracket = "{";
    let rightBracket = "}";

    if (result.length != 0) {
      leftBracket = leftBracket + " ";
      rightBracket = " " + rightBracket;
    }

    return leftBracket + result.join(", ") + rightBracket;
  }
}