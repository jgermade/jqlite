import { describe, expect, it } from 'vitest';
import $, { ListDOM, jqlite } from '../src/index.js';

describe('$ factory', () => {
  it('default export and named exports are the same function', () => {
    expect(jqlite).toBe($);
  });

  it('queries by CSS selector', () => {
    document.body.innerHTML = '<div id="one" class="foo"></div><div class="foo"></div>';
    expect($('#one').length).toBe(1);
    expect($('.foo').length).toBe(2);
    expect($('body .foo').length).toBe(2);
    expect($('#one')[0]).toBe(document.getElementById('one'));
  });

  it('queries within a context', () => {
    document.body.innerHTML = '<div id="a"><span></span></div><div id="b"><span></span><span></span></div>';
    expect($('span', document.getElementById('b')).length).toBe(2);
    expect($('span', $('#a')).length).toBe(1);
  });

  it('builds collections from HTML strings', () => {
    const list = $('<div class="foo">bar</div>');
    expect(list.length).toBe(1);
    expect(list[0].className).toBe('foo');
    expect(list[0].textContent).toBe('bar');
  });

  it('builds collections from HTML strings with several root elements', () => {
    const list = $('<div class="foo">bar</div><div class="bar">foo</div>');
    expect(list.length).toBe(2);
    expect(list[1].className).toBe('bar');
  });

  it('returns the same instance when passed a ListDOM', () => {
    document.body.innerHTML = '<div></div>';
    const list = $('div');
    expect($(list)).toBe(list);
  });

  it('wraps elements, window and document', () => {
    document.body.innerHTML = '<div id="one"></div>';
    const el = document.getElementById('one');
    expect($(el)[0]).toBe(el);
    expect($(el).length).toBe(1);
    expect($(document)[0]).toBe(document);
    expect($(window)[0]).toBe(window);
  });

  it('wraps arrays and NodeLists', () => {
    document.body.innerHTML = '<i></i><i></i>';
    expect($(document.querySelectorAll('i')).length).toBe(2);
    expect($([...document.querySelectorAll('i')]).length).toBe(2);
  });

  it('returns an empty collection for null/undefined', () => {
    expect($().length).toBe(0);
    expect($(null).length).toBe(0);
  });

  it('runs functions via ready and returns a collection', () => {
    let called = false;
    const list = $(() => {
      called = true;
    });
    expect(called).toBe(true);
    expect(list[0]).toBe(document);
  });

  it('collections are real arrays', () => {
    document.body.innerHTML = '<div></div><div></div>';
    const list = $('div');
    expect(Array.isArray(list)).toBe(true);
    expect(list instanceof ListDOM).toBe(true);
    expect(list.slice(0, 1) instanceof ListDOM).toBe(true);
    expect(list.map((el) => el) instanceof ListDOM).toBe(true);
  });
});

describe('$.extend', () => {
  it('shallow-extends a target and returns it', () => {
    const target = { a: 1, nested: { x: 1 } };
    const result = $.extend(target, { b: 2 }, { c: 3, nested: { y: 2 } });
    expect(result).toBe(target);
    expect(result).toEqual({ a: 1, b: 2, c: 3, nested: { y: 2 } });
  });

  it('deep-merges when first argument is true', () => {
    const result = $.extend(true, { nested: { x: 1 }, list: [1] }, { nested: { y: 2 }, list: [2] });
    expect(result.nested).toEqual({ x: 1, y: 2 });
    expect(result.list).toEqual([1, 2]);
  });

  it('ignores null/undefined sources', () => {
    expect($.extend({ a: 1 }, null, undefined, { b: 2 })).toEqual({ a: 1, b: 2 });
  });
});

describe('$.contains', () => {
  it('reports containment', () => {
    document.body.innerHTML = '<div id="outer"><div id="inner"></div></div>';
    const outer = document.getElementById('outer');
    const inner = document.getElementById('inner');
    expect($.contains(outer, inner)).toBe(true);
    expect($.contains(inner, outer)).toBe(false);
    expect($.contains(document.body, inner)).toBe(true);
  });

  it('an element does not contain itself', () => {
    document.body.innerHTML = '<div id="one"></div>';
    const el = document.getElementById('one');
    expect($.contains(el, el)).toBe(false);
  });

  it('requires two arguments', () => {
    expect(() => $.contains(document.body)).toThrow();
  });
});

describe('type-check statics', () => {
  it('isObject', () => {
    expect($.isObject({})).toBe(true);
    expect($.isObject([])).toBe(true);
    expect($.isObject(null)).toBe(false);
    expect($.isObject('a')).toBe(false);
  });

  it('isFunction / isString / isNumber / isBoolean', () => {
    expect($.isFunction(() => {})).toBe(true);
    expect($.isString('a')).toBe(true);
    expect($.isNumber(1)).toBe(true);
    expect($.isBoolean(false)).toBe(true);
    expect($.isFunction('a')).toBe(false);
    expect($.isString(1)).toBe(false);
    expect($.isNumber('1')).toBe(false);
    expect($.isBoolean(0)).toBe(false);
  });

  it('isArray / isDate / isRegExp / isElement', () => {
    expect($.isArray([])).toBe(true);
    expect($.isDate(new Date())).toBe(true);
    expect($.isRegExp(/a/)).toBe(true);
    expect($.isElement(document.createElement('div'))).toBe(true);
    expect($.isArray({})).toBe(false);
    expect($.isDate('2020-01-01')).toBe(false);
    expect($.isRegExp('a')).toBe(false);
    expect($.isElement(document.createTextNode('a'))).toBe(false);
  });
});

describe('$.fn and instance extend', () => {
  it('$.fn extends the collection prototype', () => {
    $.fn.answer = function () {
      return 42;
    };
    expect($('<div></div>').answer()).toBe(42);
    delete $.fn.answer;
  });

  it('instance extend adds prototype methods', () => {
    $('<div></div>').extend({
      firstTag () {
        return this[0] && this[0].tagName;
      }
    });
    expect($('<span></span>').firstTag()).toBe('SPAN');
    delete $.fn.firstTag;
  });
});

describe('$.ready', () => {
  it('runs the callback when the document is already loaded', () => {
    let called = false;
    $.ready(() => {
      called = true;
    });
    expect(called).toBe(true);
  });

  it('ignores non-function arguments', () => {
    expect(() => $.ready('nope')).not.toThrow();
  });
});

describe('$.noConflict', () => {
  it('removes $ from window only when it points to jqlite', () => {
    window.$ = $;
    expect($.noConflict()).toBe($);
    expect(window.$).toBeUndefined();

    const other = {};
    window.$ = other;
    $.noConflict();
    expect(window.$).toBe(other);
    delete window.$;
  });
});
