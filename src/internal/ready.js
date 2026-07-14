import { isFunction } from './type-checks.js';

export function ready (callback) {
  if (!isFunction(callback)) return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => callback(), { once: true });
  } else {
    callback();
  }
}
