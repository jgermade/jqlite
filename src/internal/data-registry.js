const registry = new WeakMap();

export function getData (element, key) {
  const data = registry.get(element);
  return data ? data.get(key) : undefined;
}

export function getAllData (element) {
  const data = registry.get(element);
  return data ? Object.fromEntries(data) : {};
}

export function setData (element, key, value) {
  let data = registry.get(element);
  if (!data) {
    data = new Map();
    registry.set(element, data);
  }
  data.set(key, value);
}

export function removeData (element, key) {
  const data = registry.get(element);
  if (!data) return;
  if (key === undefined) {
    registry.delete(element);
  } else {
    data.delete(key);
  }
}
