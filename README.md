# jqLite

Tiny jQuery-like DOM query library for modern browsers. Pure CSS selectors, chainable collections that are real arrays, zero dependencies.

Where the API overlaps jQuery, it follows jQuery semantics — but it is built entirely on native modern DOM APIs (`querySelectorAll`, `matches`, `closest`, `classList`, `template`, `append`/`prepend`/`before`/`after`), so there is no selector engine and no legacy-browser code.

## Installation

```sh
npm install jqlite
```

```js
// ESM
import $ from 'jqlite';

// CommonJS
const $ = require('jqlite');
```

Or from a CDN (exposes `window.jqlite`, and `window.$` if it is free):

```html
<script src="https://unpkg.com/jqlite"></script>
```

## Usage

```js
// CSS selectors, optionally within a context
$('#wrapper .item');
$('span', someElement);

// HTML strings starting with '<' build detached collections
$('<div class="foo">bar</div>');

// Elements, NodeLists, arrays, window, document
$(document.querySelectorAll('li'));

// $(fn) runs fn when the DOM is ready
$(() => console.log('ready'));
```

Collections extend `Array`, so `Array.isArray($('div'))` is `true` and native array methods (`map`, `slice`, `some`, …) work and return collections.

## API

**Traversal** — `get()`, `eq()`, `first()`, `last()`, `find()`, `add()`, `each()`, `filter()`, `closest()`, `children()`, `parent()`, `contents()`, `next()`, `nextAll()`, `prev()`, `prevAll()`

**Classes** — `addClass()`, `removeClass()`, `toggleClass()`, `hasClass()`

**Attributes / data** — `attr()`, `removeAttr()`, `prop()`, `val()`, `data()`, `removeData()`

**Manipulation** — `append()`, `appendTo()`, `prepend()`, `before()`, `after()`, `wrap()`, `replaceWith()`, `remove()`, `detach()`, `empty()`, `clone()`, `html()`, `text()`

**CSS / dimensions** — `css()`, `show()`, `hide()`, `position()`, `offset()`, `width()`, `height()`

**Events** — `on()`, `off()`, `one()`, `trigger()`, `hover()`, `mouseenter()`, `mouseleave()`, `click()`, `focus()`, `blur()`, `submit()`

**Statics** — `$.extend()`, `$.contains()`, `$.ready()`, `$.noConflict()`, `$.fn` (plugin extension point), `$.isObject()` / `isFunction()` / `isString()` / `isNumber()` / `isBoolean()` / `isArray()` / `isDate()` / `isRegExp()` / `isElement()`

Semantics match the jQuery documentation for the shared surface, with these deliberate omissions:

- No animations — `show()`/`hide()` are plain `display` toggles; use CSS transitions.
- No `css('+=5')` relative-value shorthand.
- No event namespaces or delegated selectors in `on()`/`off()`.
- `html(value)` never executes embedded `<script>` tags.

## Development

```sh
npm test        # vitest + happy-dom
npm run lint    # eslint
npm run build   # esbuild → dist/ (ESM, CJS, browser global)
```

## License

[MIT](LICENSE)
