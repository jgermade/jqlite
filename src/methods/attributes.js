import { isFunction } from '../internal/type-checks.js';
import { getAllData, getData, removeData, setData } from '../internal/data-registry.js';

const RE_NUMBER = /^[+-]?\d+(\.\d+)?$/;

function parseDataAttr (value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (RE_NUMBER.test(value)) return Number(value);
  const char0 = value.charAt(0);
  if (char0 === '{' || char0 === '[') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

export default {
  attr (key, value) {
    if (isFunction(value)) {
      return this.each((i, element) => {
        element.setAttribute(key, value.call(element, i, element.getAttribute(key)));
      });
    }
    if (value !== undefined) {
      return this.each((_i, element) => element.setAttribute(key, value));
    }
    if (!this[0]) return undefined;
    const found = this[0].getAttribute(key);
    return found === null ? undefined : found;
  },

  removeAttr (key) {
    return this.each((_i, element) => element.removeAttribute(key));
  },

  prop (key, value) {
    if (isFunction(value)) {
      return this.each((i, element) => {
        element[key] = value.call(element, i, element[key]);
      });
    }
    if (value !== undefined) {
      return this.each((_i, element) => {
        element[key] = value;
      });
    }
    return this[0] ? this[0][key] : undefined;
  },

  val (value) {
    if (value === undefined) {
      const element = this[0];
      if (!element) return undefined;
      return 'value' in element ? element.value : undefined;
    }
    return this.each((_i, element) => {
      if ('value' in element) {
        element.value = value;
      } else {
        element.setAttribute('value', value);
      }
    });
  },

  data (key, value) {
    if (key === undefined) {
      const element = this[0];
      if (!element) return undefined;
      const data = {};
      for (const [name, raw] of Object.entries(element.dataset || {})) {
        data[name] = parseDataAttr(raw);
      }
      return Object.assign(data, getAllData(element));
    }
    if (value === undefined) {
      const element = this[0];
      if (!element) return undefined;
      const stored = getData(element, key);
      if (stored !== undefined) return stored;
      const attr = element.dataset && element.dataset[key];
      return attr === undefined ? undefined : parseDataAttr(attr);
    }
    return this.each((_i, element) => setData(element, key, value));
  },

  removeData (key) {
    return this.each((_i, element) => removeData(element, key));
  }
};
