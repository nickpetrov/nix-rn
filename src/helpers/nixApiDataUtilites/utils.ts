function defaults(source: any, ...rest: any) {
  for (let i = 0; i < rest.length; i++) {
    Object.keys(rest[i]).forEach(key => {
      if (source[key] === undefined) {
        source[key] = rest[i][key];
      }
    });
  }
  return source;
}

function mapKeys(obj: any, fnc: any) {
  var returnObj = {};
  Object.keys(obj).forEach(key => {
    let newKey = fnc(obj[key], key, obj);
    returnObj[newKey] = obj[key];
  });
  return returnObj;
}

function reduce(
  collection: any,
  fn: (result: any, item: any, idxOrKey: any, collection: any) => void,
  accum: any,
) {
  var isArr = Array.isArray(collection);
  var hasAccumulator = arguments.length >= 3;
  var result = accum;

  // bind new iterator fn to collection & accum
  function iterator(item, idxOrKey) {
    if (!hasAccumulator) {
      result = item;
      hasAccumulator = true;
    } else {
      result = fn(result, item, idxOrKey, collection);
    }
  }

  if (isArr) {
    for (var i = 0; i < collection.length; i++) {
      iterator(collection[i], i);
    }
  } else if (collection) {
    let keys = Object.keys(collection);
    for (var i = 0; i < keys.length; i++) {
      let val = collection[keys[i]];
      iterator(val, keys[i]);
    }
  }
  return result;
}

function uniqBy(array: any, comparator: any) {
  let uniqKeys = {};
  let result = [];

  array.forEach(item => {
    let keyTest = comparator(item);
    if (!uniqKeys[keyTest]) {
      uniqKeys[keyTest] = true;
      result.push(item);
    }
  });

  return result;
}

function keys(obj: any) {
  let ownKeys = [];
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) ownKeys.push(prop);
  }
  return ownKeys;
}

function pickBy(obj: any, predicate: any) {
  predicate = predicate || (x => x);
  let result = {};
  for (let key of keys(obj)) {
    let shouldPick = predicate(obj[key], key);
    if (shouldPick) result[key] = obj[key];
  }
  return result;
}

export default {
  defaults,
  mapKeys,
  reduce,
  uniqBy,
  keys,
  pickBy,
};
