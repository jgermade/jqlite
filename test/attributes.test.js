import { beforeEach, describe, expect, it } from 'vitest';
import $ from '../src/index.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('attr', () => {
  it('gets the attribute of the first element', () => {
    document.body.innerHTML = '<a href="/one"></a><a href="/two"></a>';
    expect($('a').attr('href')).toBe('/one');
  });

  it('returns undefined for missing attributes and empty collections', () => {
    document.body.innerHTML = '<a></a>';
    expect($('a').attr('href')).toBeUndefined();
    expect($('nope').attr('href')).toBeUndefined();
  });

  it('sets the attribute on every element', () => {
    document.body.innerHTML = '<a></a><a></a>';
    const list = $('a').attr('rel', 'noopener');
    expect(list.length).toBe(2);
    expect(list[1].getAttribute('rel')).toBe('noopener');
  });

  it('accepts a function receiving (index, oldValue)', () => {
    document.body.innerHTML = '<a href="/a"></a><a href="/b"></a>';
    $('a').attr('href', (i, old) => old + '/' + i);
    expect($('a').eq(1).attr('href')).toBe('/b/1');
  });
});

describe('removeAttr', () => {
  it('removes the attribute from every element', () => {
    document.body.innerHTML = '<a href="/a"></a><a href="/b"></a>';
    $('a').removeAttr('href');
    expect(document.querySelectorAll('a[href]').length).toBe(0);
  });
});

describe('prop', () => {
  it('gets the property of the first element', () => {
    document.body.innerHTML = '<input type="checkbox" checked>';
    expect($('input').prop('checked')).toBe(true);
  });

  it('sets the property on every element', () => {
    document.body.innerHTML = '<input type="checkbox"><input type="checkbox">';
    $('input').prop('checked', true);
    expect(document.querySelectorAll('input')[1].checked).toBe(true);
  });

  it('accepts a function receiving (index, oldValue)', () => {
    document.body.innerHTML = '<input type="checkbox" checked><input type="checkbox">';
    $('input').prop('checked', (_i, old) => !old);
    const inputs = document.querySelectorAll('input');
    expect(inputs[0].checked).toBe(false);
    expect(inputs[1].checked).toBe(true);
  });
});

describe('val', () => {
  it('gets and sets input values', () => {
    document.body.innerHTML = '<input value="initial">';
    expect($('input').val()).toBe('initial');
    $('input').val('changed');
    expect(document.querySelector('input').value).toBe('changed');
  });

  it('works with textareas', () => {
    document.body.innerHTML = '<textarea>hello</textarea>';
    expect($('textarea').val()).toBe('hello');
  });

  it('gets the selected option value from a <select>', () => {
    document.body.innerHTML = `
      <select>
        <option value="a">A</option>
        <option value="b" selected>B</option>
      </select>
    `;
    expect($('select').val()).toBe('b');
  });

  it('sets the selected option of a <select>', () => {
    document.body.innerHTML = `
      <select>
        <option value="a">A</option>
        <option value="b">B</option>
      </select>
    `;
    $('select').val('b');
    expect(document.querySelector('select').value).toBe('b');
    expect(document.querySelectorAll('option')[1].selected).toBe(true);
  });

  it('returns undefined for empty collections and value-less elements', () => {
    document.body.innerHTML = '<div></div>';
    expect($('nope').val()).toBeUndefined();
    expect($('div').val()).toBeUndefined();
  });
});

describe('data / removeData', () => {
  it('stores and reads arbitrary values without touching attributes', () => {
    document.body.innerHTML = '<div></div>';
    const value = { deep: [1, 2] };
    $('div').data('payload', value);
    expect($('div').data('payload')).toBe(value);
    expect(document.querySelector('div').attributes.length).toBe(0);
  });

  it('reads data-* attributes as fallback', () => {
    document.body.innerHTML = '<div data-role="admin"></div>';
    expect($('div').data('role')).toBe('admin');
  });

  it('coerces data-* attribute values like jQuery', () => {
    document.body.innerHTML =
      '<div data-num="42" data-float="1.5" data-bool="true" data-off="false" data-nil="null" data-json=\'{"a":1}\' data-list="[1,2]"></div>';
    const list = $('div');
    expect(list.data('num')).toBe(42);
    expect(list.data('float')).toBe(1.5);
    expect(list.data('bool')).toBe(true);
    expect(list.data('off')).toBe(false);
    expect(list.data('nil')).toBe(null);
    expect(list.data('json')).toEqual({ a: 1 });
    expect(list.data('list')).toEqual([1, 2]);
  });

  it('stored data wins over attributes', () => {
    document.body.innerHTML = '<div data-role="admin"></div>';
    $('div').data('role', 'user');
    expect($('div').data('role')).toBe('user');
  });

  it('returns the full data object with no arguments', () => {
    document.body.innerHTML = '<div data-count="3"></div>';
    $('div').data('name', 'x');
    expect($('div').data()).toEqual({ count: 3, name: 'x' });
  });

  it('removeData removes one key or all keys', () => {
    document.body.innerHTML = '<div></div>';
    const list = $('div');
    list.data('a', 1).data('b', 2);
    list.removeData('a');
    expect(list.data('a')).toBeUndefined();
    expect(list.data('b')).toBe(2);
    list.removeData();
    expect(list.data('b')).toBeUndefined();
  });

  it('returns undefined on empty collections', () => {
    expect($('nope').data('x')).toBeUndefined();
  });
});
