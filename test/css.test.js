// happy-dom has no layout engine, so offset()/position()/width()/height()
// getters are asserted on shape and style side-effects, not real pixels.
import { beforeEach, describe, expect, it } from 'vitest';
import $ from '../src/index.js';

beforeEach(() => {
  document.body.innerHTML = '<div id="box"></div><div id="other"></div>';
});

describe('css', () => {
  it('sets a single property on every element', () => {
    $('div').css('color', 'red');
    expect(document.getElementById('box').style.color).toBe('red');
    expect(document.getElementById('other').style.color).toBe('red');
  });

  it('appends px to plain numbers', () => {
    $('#box').css('width', 100);
    expect(document.getElementById('box').style.width).toBe('100px');
  });

  it('leaves unitless properties alone', () => {
    $('#box').css('opacity', 0.5);
    expect(document.getElementById('box').style.opacity).toBe('0.5');
  });

  it('sets an object of properties', () => {
    $('#box').css({ color: 'blue', marginTop: 10 });
    const style = document.getElementById('box').style;
    expect(style.color).toBe('blue');
    expect(style.marginTop).toBe('10px');
  });

  it('accepts a function receiving (index, currentValue)', () => {
    $('div').css('zIndex', (i) => i + 1);
    expect(document.getElementById('other').style.zIndex).toBe('2');
  });

  it('reads the value from the first element', () => {
    $('#box').css('color', 'green');
    expect($('div').css('color')).toBe('green');
  });

  it('returns undefined on empty collections', () => {
    expect($('nope').css('color')).toBeUndefined();
  });
});

describe('show / hide', () => {
  it('hide sets display none, show clears it', () => {
    const list = $('#box');
    list.hide();
    expect(document.getElementById('box').style.display).toBe('none');
    list.show();
    expect(document.getElementById('box').style.display).toBe('');
  });
});

describe('position', () => {
  it('returns top/left numbers for the first element', () => {
    const position = $('#box').position();
    expect(typeof position.top).toBe('number');
    expect(typeof position.left).toBe('number');
  });

  it('returns undefined on empty collections', () => {
    expect($('nope').position()).toBeUndefined();
  });
});

describe('offset', () => {
  it('returns top/left numbers for the first element', () => {
    const offset = $('#box').offset();
    expect(typeof offset.top).toBe('number');
    expect(typeof offset.left).toBe('number');
  });

  it('setter positions the element and is chainable', () => {
    const list = $('#box').offset({ top: 10, left: 20 });
    const style = document.getElementById('box').style;
    expect(list[0].id).toBe('box');
    expect(style.position).toBe('relative');
    expect(style.top).toMatch(/px$/);
    expect(style.left).toMatch(/px$/);
  });

  it('returns undefined on empty collections', () => {
    expect($('nope').offset()).toBeUndefined();
  });
});

describe('width / height', () => {
  it('setters write style with px for numbers', () => {
    $('#box').width(120).height('3em');
    const style = document.getElementById('box').style;
    expect(style.width).toBe('120px');
    expect(style.height).toBe('3em');
  });

  it('getters return numbers', () => {
    expect(typeof $('#box').width()).toBe('number');
    expect(typeof $('#box').height()).toBe('number');
  });

  it('getters return undefined on empty collections', () => {
    expect($('nope').width()).toBeUndefined();
    expect($('nope').height()).toBeUndefined();
  });
});
