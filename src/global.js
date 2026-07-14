import { jqlite } from './jqlite.js';

window.jqlite = jqlite;
if (!window.$) {
  window.$ = jqlite;
}
