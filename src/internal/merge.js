import { isArray, isDate, isObject, isRegExp } from './type-checks.js';

export function extend (target, ...sources) {
  for (const source of sources) {
    if (source == null) continue;
    for (const key of Object.keys(source)) {
      target[key] = source[key];
    }
  }
  return target;
}

export function merge (target, ...sources) {
  for (const source of sources) {
    if (source == null) continue;
    for (const key of Object.keys(source)) {
      const value = source[key];
      if (value === undefined) continue;
      if (isArray(value)) {
        target[key] = isArray(target[key]) ? target[key].concat(value) : value.slice();
      } else if (isObject(value) && !isDate(value) && !isRegExp(value)) {
        const base = isObject(target[key]) && !isArray(target[key]) ? target[key] : {};
        target[key] = merge(base, value);
      } else {
        target[key] = value;
      }
    }
  }
  return target;
}
