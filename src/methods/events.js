import { isFunction, isObject, isString } from '../internal/type-checks.js';
import { addListener, removeListener, removeListeners } from '../internal/listener-registry.js';

function eachEventName (eventName, callback) {
  for (const name of eventName.trim().split(/\s+/)) {
    callback(name);
  }
}

function addListListeners (list, eventName, listener, once) {
  if (isString(eventName)) {
    if (!isFunction(listener)) {
      throw new TypeError('listener needs to be a function');
    }
    eachEventName(eventName, (name) => {
      for (const element of list) {
        addListener(element, name, listener, once);
      }
    });
  } else if (isObject(eventName)) {
    for (const name of Object.keys(eventName)) {
      addListListeners(list, name, eventName[name], once);
    }
  }
  return list;
}

const events = {
  on (eventName, listener) {
    return addListListeners(this, eventName, listener, false);
  },

  one (eventName, listener) {
    return addListListeners(this, eventName, listener, true);
  },

  off (eventName, listener) {
    if (eventName === undefined) {
      for (const element of this) {
        removeListeners(element);
      }
      return this;
    }
    if (!isString(eventName) || (listener !== undefined && !isFunction(listener))) {
      throw new TypeError('bad arguments');
    }
    eachEventName(eventName, (name) => {
      for (const element of this) {
        if (listener) {
          removeListener(element, name, listener);
        } else {
          removeListeners(element, name);
        }
      }
    });
    return this;
  },

  trigger (eventName, args, data) {
    if (!isString(eventName)) {
      throw new TypeError('bad arguments');
    }
    for (const element of this) {
      const event = new Event(eventName, { bubbles: true, cancelable: true });
      event.args = args;
      event.data = data;
      element.dispatchEvent(event);
    }
    return this;
  },

  hover (mouseIn, mouseOut) {
    return this.mouseenter(mouseIn).mouseleave(mouseOut);
  }
};

events.once = events.one;

for (const name of ['click', 'focus', 'blur']) {
  events[name] = function (listener) {
    if (listener) return this.on(name, listener);
    return this.each((_i, element) => element[name]());
  };
}

// form.submit() does not fire the submit event, so the no-arg shorthand
// dispatches the event instead (matching $().trigger('submit')).
events.submit = function (listener) {
  if (listener) return this.on('submit', listener);
  return this.trigger('submit');
};

for (const name of ['mouseenter', 'mouseleave']) {
  events[name] = function (listener) {
    return this.on(name, listener);
  };
}

export default events;
