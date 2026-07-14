export function isObject (value) {
  return typeof value === 'object' && value !== null;
}

export function isFunction (value) {
  return typeof value === 'function';
}

export function isString (value) {
  return typeof value === 'string';
}

export function isNumber (value) {
  return typeof value === 'number';
}

export function isBoolean (value) {
  return typeof value === 'boolean';
}

export const isArray = Array.isArray;

export function isDate (value) {
  return value instanceof Date;
}

export function isRegExp (value) {
  return value instanceof RegExp;
}

export function isElement (value) {
  return !!value && value.nodeType === 1;
}
