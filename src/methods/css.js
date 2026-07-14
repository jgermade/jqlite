import { isFunction, isNumber, isObject, isString } from '../internal/type-checks.js';

const UNITLESS = new Set([
  'animationIterationCount',
  'columnCount',
  'flex',
  'flexGrow',
  'flexShrink',
  'fontWeight',
  'gridArea',
  'gridColumn',
  'gridRow',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'widows',
  'zIndex',
  'zoom'
]);

function styleValue (key, value) {
  return isNumber(value) && !UNITLESS.has(key) ? value + 'px' : value;
}

function computed (element, property) {
  return parseFloat(window.getComputedStyle(element).getPropertyValue(property)) || 0;
}

function dimension (list, name, value) {
  if (value !== undefined) {
    return list.each((_i, element) => {
      element.style[name] = styleValue(name, value);
    });
  }
  const element = list[0];
  if (!element) return undefined;
  const edges = name === 'width'
    ? ['border-left-width', 'padding-left', 'padding-right', 'border-right-width']
    : ['border-top-width', 'padding-top', 'padding-bottom', 'border-bottom-width'];
  let result = element[name === 'width' ? 'offsetWidth' : 'offsetHeight'];
  for (const edge of edges) {
    result -= computed(element, edge);
  }
  return result;
}

export default {
  css (key, value) {
    if (isObject(key)) {
      for (const name of Object.keys(key)) {
        this.css(name, key[name]);
      }
      return this;
    }
    if (value !== undefined) {
      if (isFunction(value)) {
        return this.each((i, element) => {
          element.style[key] = styleValue(key, value.call(element, i, element.style[key]));
        });
      }
      return this.each((_i, element) => {
        element.style[key] = styleValue(key, value);
      });
    }
    if (!this[0] || !isString(key)) return undefined;
    return this[0].style[key] || window.getComputedStyle(this[0])[key];
  },

  show () {
    return this.each((_i, element) => {
      element.style.display = '';
    });
  },

  hide () {
    return this.each((_i, element) => {
      element.style.display = 'none';
    });
  },

  position () {
    const element = this[0];
    if (!element) return undefined;
    return {
      top: element.offsetTop,
      left: element.offsetLeft
    };
  },

  offset (coordinates) {
    if (coordinates === undefined) {
      const element = this[0];
      if (!element) return undefined;
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      };
    }
    if (isFunction(coordinates)) coordinates = coordinates();
    if (isObject(coordinates) && coordinates.top !== undefined && coordinates.left !== undefined) {
      this.each((_i, element) => {
        const rect = element.getBoundingClientRect();
        if (window.getComputedStyle(element).position === 'static') {
          element.style.position = 'relative';
        }
        element.style.top = coordinates.top - (rect.top + window.scrollY) + parseFloat(element.style.top || 0) + 'px';
        element.style.left = coordinates.left - (rect.left + window.scrollX) + parseFloat(element.style.left || 0) + 'px';
      });
    }
    return this;
  },

  width (value) {
    return dimension(this, 'width', value);
  },

  height (value) {
    return dimension(this, 'height', value);
  }
};
