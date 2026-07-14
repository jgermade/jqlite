import { isBoolean } from './internal/type-checks.js';
import { extend, merge } from './internal/merge.js';
import { ready } from './internal/ready.js';
import traversal from './methods/traversal.js';
import attributes from './methods/attributes.js';
import classes from './methods/classes.js';
import manipulation from './methods/manipulation.js';
import css from './methods/css.js';
import events from './methods/events.js';

export class ListDOM extends Array {
  static fromNodes (nodes) {
    const list = new ListDOM();
    if (nodes) {
      for (let i = 0, len = nodes.length; i < len; i++) {
        list.push(nodes[i]);
      }
    }
    return list;
  }
}

Object.assign(
  ListDOM.prototype,
  traversal,
  attributes,
  classes,
  manipulation,
  css,
  events,
  {
    ready (callback) {
      ready(callback);
      return this;
    },

    extend (deep, ...sources) {
      if (!isBoolean(deep)) {
        sources.unshift(deep);
        deep = false;
      }
      (deep ? merge : extend)(ListDOM.prototype, ...sources);
      return this;
    }
  }
);
