export function coerceJS(value) {
  if (value) {
    if (value.class) {
      switch (coerceString(value.class())) {
        case '__NSCFString':
        case '__NSCFConstantString':
        case 'NSTaggedPointerString':
        case 'NSPathStore2':
          return coerceString(value);
        case '__NSCFDictionary':
        case '__NSDictionaryI':
          return coerceObject(value);
        case '__NSCFArrayI':
        case '__NSArrayM':
          return coerceArray(value);
        case '__NSCFNumber':
          return coerceNumber(value);
        default: return value;
      }
    } else if (Array.isArray(value)) {
      return value.map(coerceJS);
    } else if (typeof value === 'object') {
      const newObj = {};
      for (var key in value) {
        newObj[key] = coerceJS(value[key]);
      }
      return newObj;
    }
  }

  return value;
}

export function coerceString(str) {
  if (str) {
    return '' + str;
  } else {
    return null;
  }
}

export function coerceNumber(number) {
  return number + 0;
}

export function coerceBool(number) {
  return !!(number + 0);
}

export function coerceArray(array) {
  var result = [];
  $.forEach(array, function(item) {
    result.push(coerceJS(item));
  });
  return result;
}

export function coerceObject(dict) {
  var result = {};
  $.forEach(dict.allKeys(), function(key) {
    result[key] = coerceJS(dict[key]);
  });
  return result;
}
