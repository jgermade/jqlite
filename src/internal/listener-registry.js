import { isArray } from './type-checks.js';

const registry = new WeakMap();

function entriesFor (element, eventName, create) {
  let events = registry.get(element);
  if (!events) {
    if (!create) return null;
    events = new Map();
    registry.set(element, events);
  }
  let entries = events.get(eventName);
  if (!entries) {
    if (!create) return null;
    entries = [];
    events.set(eventName, entries);
  }
  return entries;
}

export function addListener (element, eventName, listener, once) {
  const wrapped = (event) => {
    if (once) removeListener(element, eventName, listener);
    const args = event.args === undefined ? [] : isArray(event.args) ? event.args : [event.args];
    listener.call(element, event, ...args);
  };
  entriesFor(element, eventName, true).push({ listener, wrapped });
  element.addEventListener(eventName, wrapped);
}

export function removeListener (element, eventName, listener) {
  const entries = entriesFor(element, eventName, false);
  if (!entries) return;
  const index = entries.findIndex((entry) => entry.listener === listener);
  if (index < 0) return;
  element.removeEventListener(eventName, entries[index].wrapped);
  entries.splice(index, 1);
}

export function removeListeners (element, eventName) {
  const events = registry.get(element);
  if (!events) return;
  const names = eventName === undefined ? [...events.keys()] : [eventName];
  for (const name of names) {
    for (const entry of events.get(name) || []) {
      element.removeEventListener(name, entry.wrapped);
    }
    events.delete(name);
  }
}
