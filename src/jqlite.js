import { ListDOM } from './list-dom.js';
import { fragment, isHtmlString } from './internal/fragment.js';
import { extend, merge } from './internal/merge.js';
import { ready } from './internal/ready.js';
import {
  isArray,
  isBoolean,
  isDate,
  isElement,
  isFunction,
  isNumber,
  isObject,
  isRegExp,
  isString
} from './internal/type-checks.js';

export function jqlite (selector, context) {
  if (isString(selector)) {
    if (isHtmlString(selector)) {
      return ListDOM.fromNodes(fragment(selector));
    }
    let root = context === undefined ? document : context;
    if (root instanceof ListDOM) root = root[0];
    return root ? ListDOM.fromNodes(root.querySelectorAll(selector)) : new ListDOM();
  }

  if (selector instanceof ListDOM) return selector;
  if (selector == null) return new ListDOM();

  if (isFunction(selector)) {
    ready(selector);
    return ListDOM.fromNodes([document]);
  }

  if (selector === window || selector.nodeType) {
    return ListDOM.fromNodes([selector]);
  }

  if (typeof selector.length === 'number') {
    return ListDOM.fromNodes(selector);
  }

  return new ListDOM();
}

jqlite.fn = ListDOM.prototype;

jqlite.extend = function (deep, ...sources) {
  if (!isBoolean(deep)) {
    sources.unshift(deep);
    deep = false;
  }
  const target = sources.shift();
  return (deep ? merge : extend)(target, ...sources);
};

jqlite.ready = ready;

jqlite.contains = function (container, contained) {
  if (arguments.length < 2) {
    throw new Error('2 arguments required');
  }
  return container !== contained && container.contains(contained);
};

jqlite.noConflict = function () {
  if (typeof window !== 'undefined' && window.$ === jqlite) {
    delete window.$;
  }
  return jqlite;
};

Object.assign(jqlite, {
  isObject,
  isFunction,
  isString,
  isNumber,
  isBoolean,
  isArray,
  isDate,
  isRegExp,
  isElement
});
