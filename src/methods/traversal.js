import { jqlite as $ } from '../jqlite.js';
import { ListDOM } from '../list-dom.js';
import { isFunction, isString } from '../internal/type-checks.js';

function unique (list) {
  if (list.length <= 1) return list;
  return ListDOM.fromNodes([...new Set(list)]);
}

export default {
  get (pos) {
    if (pos === undefined) return [...this];
    return pos < 0 ? this[this.length + pos] : this[pos];
  },

  eq (pos) {
    const item = pos < 0 ? this[this.length + pos] : this[pos];
    return item ? ListDOM.fromNodes([item]) : new ListDOM();
  },

  first () {
    return this.eq(0);
  },

  last () {
    return this.eq(-1);
  },

  find (selector) {
    if (!selector) return this;
    if (/^\s*[>+~]/.test(selector)) selector = ':scope ' + selector;
    const list = new ListDOM();
    for (const element of this) {
      list.push(...element.querySelectorAll(selector));
    }
    return unique(list);
  },

  add (selector, context) {
    return unique(ListDOM.fromNodes([...this, ...$(selector, context)]));
  },

  each (callback) {
    if (isFunction(callback)) {
      for (let i = 0; i < this.length; i++) {
        callback.call(this[i], i, this[i]);
      }
    }
    return this;
  },

  filter (selector) {
    const list = new ListDOM();
    for (let i = 0; i < this.length; i++) {
      const element = this[i];
      const keep = isFunction(selector)
        ? selector.call(element, i, element)
        : isString(selector) && !!element.matches && element.matches(selector);
      if (keep) list.push(element);
    }
    return list;
  },

  closest (selector) {
    if (!selector) return this;
    const list = new ListDOM();
    for (const element of this) {
      const found = element.closest && element.closest(selector);
      if (found) list.push(found);
    }
    return unique(list);
  },

  children (selector) {
    const list = new ListDOM();
    for (const element of this) {
      list.push(...element.children);
    }
    return selector ? list.filter(selector) : list;
  },

  parent (selector) {
    const list = new ListDOM();
    for (const element of this) {
      if (element.parentElement) list.push(element.parentElement);
    }
    return unique(selector ? list.filter(selector) : list);
  },

  contents () {
    const list = new ListDOM();
    for (const element of this) {
      list.push(...element.childNodes);
    }
    return list;
  },

  next (selector) {
    const list = new ListDOM();
    for (const element of this) {
      if (element.nextElementSibling) list.push(element.nextElementSibling);
    }
    return selector ? list.filter(selector) : list;
  },

  nextAll (selector) {
    const list = new ListDOM();
    for (const element of this) {
      let sibling = element.nextElementSibling;
      while (sibling) {
        list.push(sibling);
        sibling = sibling.nextElementSibling;
      }
    }
    return unique(selector ? list.filter(selector) : list);
  },

  prev (selector) {
    const list = new ListDOM();
    for (const element of this) {
      if (element.previousElementSibling) list.push(element.previousElementSibling);
    }
    return selector ? list.filter(selector) : list;
  },

  prevAll (selector) {
    const list = new ListDOM();
    for (const element of this) {
      let sibling = element.previousElementSibling;
      while (sibling) {
        list.push(sibling);
        sibling = sibling.previousElementSibling;
      }
    }
    return unique(selector ? list.filter(selector) : list);
  }
};
