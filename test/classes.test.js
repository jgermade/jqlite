import { beforeEach, describe, expect, it } from 'vitest';
import $ from '../src/index.js';

beforeEach(() => {
  document.body.innerHTML = '<div id="a" class="base"></div><div id="b"></div>';
});

describe('addClass', () => {
  it('adds a class to every element', () => {
    $('div').addClass('extra');
    expect(document.getElementById('a').classList.contains('extra')).toBe(true);
    expect(document.getElementById('b').classList.contains('extra')).toBe(true);
  });

  it('adds multiple space-separated classes', () => {
    $('#b').addClass('one two  three');
    expect(document.getElementById('b').className).toBe('one two three');
  });

  it('accepts a function receiving (index, currentClassName)', () => {
    $('div').addClass((i, current) => 'fn-' + i + (current ? '-had' : ''));
    expect(document.getElementById('a').classList.contains('fn-0-had')).toBe(true);
    expect(document.getElementById('b').classList.contains('fn-1')).toBe(true);
  });

  it('is chainable', () => {
    expect($('div').addClass('x').addClass('y')[0].classList.contains('y')).toBe(true);
  });
});

describe('removeClass', () => {
  it('removes a class from every element', () => {
    $('div').addClass('gone stays');
    $('div').removeClass('gone');
    expect(document.getElementById('a').classList.contains('gone')).toBe(false);
    expect(document.getElementById('a').classList.contains('stays')).toBe(true);
  });

  it('removes multiple space-separated classes', () => {
    $('#a').addClass('one two three');
    $('#a').removeClass('one three');
    expect(document.getElementById('a').classList.contains('two')).toBe(true);
    expect(document.getElementById('a').classList.contains('one')).toBe(false);
  });

  it('accepts a function', () => {
    $('#a').removeClass(() => 'base');
    expect(document.getElementById('a').className).toBe('');
  });
});

describe('hasClass', () => {
  it('returns true if any element has the class', () => {
    expect($('div').hasClass('base')).toBe(true);
    expect($('div').hasClass('missing')).toBe(false);
    expect($('#b').hasClass('base')).toBe(false);
  });
});

describe('toggleClass', () => {
  it('toggles a class per element', () => {
    $('#a').addClass('flip');
    $('div').toggleClass('flip');
    expect(document.getElementById('a').classList.contains('flip')).toBe(false);
    expect(document.getElementById('b').classList.contains('flip')).toBe(true);
  });

  it('forces state with the second argument', () => {
    $('div').toggleClass('on', true);
    $('div').toggleClass('on', true);
    expect(document.getElementById('a').classList.contains('on')).toBe(true);
    $('div').toggleClass('on', false);
    expect(document.getElementById('a').classList.contains('on')).toBe(false);
  });

  it('toggles multiple space-separated classes', () => {
    $('#a').toggleClass('x y');
    expect(document.getElementById('a').classList.contains('x')).toBe(true);
    expect(document.getElementById('a').classList.contains('y')).toBe(true);
    $('#a').toggleClass('x y');
    expect(document.getElementById('a').classList.contains('x')).toBe(false);
  });

  it('accepts a function receiving (index, className, state)', () => {
    $('div').toggleClass((i) => 'fn-' + i, true);
    expect(document.getElementById('a').classList.contains('fn-0')).toBe(true);
    expect(document.getElementById('b').classList.contains('fn-1')).toBe(true);
  });
});
