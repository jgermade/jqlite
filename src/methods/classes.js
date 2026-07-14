import { isFunction } from '../internal/type-checks.js';

function classNames (element, index, className, state) {
  const value = isFunction(className)
    ? className.call(element, index, element.className, state)
    : className;
  return typeof value === 'string' ? value.split(/\s+/).filter(Boolean) : [];
}

export default {
  addClass (className) {
    return this.each((i, element) => {
      element.classList.add(...classNames(element, i, className));
    });
  },

  removeClass (className) {
    return this.each((i, element) => {
      element.classList.remove(...classNames(element, i, className));
    });
  },

  hasClass (className) {
    for (const element of this) {
      if (element.classList.contains(className)) return true;
    }
    return false;
  },

  toggleClass (className, state) {
    return this.each((i, element) => {
      for (const name of classNames(element, i, className, state)) {
        if (state === undefined) {
          element.classList.toggle(name);
        } else {
          element.classList.toggle(name, state);
        }
      }
    });
  }
};
