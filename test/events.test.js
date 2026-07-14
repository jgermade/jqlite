import { beforeEach, describe, expect, it, vi } from 'vitest';
import $ from '../src/index.js';

beforeEach(() => {
  document.body.innerHTML = '<button id="btn">go</button><input id="field">';
});

describe('on', () => {
  it('attaches a listener with the element as this', () => {
    const btn = document.getElementById('btn');
    let self = null;
    $('#btn').on('click', function () {
      self = this;
    });
    btn.dispatchEvent(new Event('click', { bubbles: true }));
    expect(self).toBe(btn);
  });

  it('supports space-separated event names', () => {
    const spy = vi.fn();
    $('#btn').on('foo bar', spy);
    $('#btn').trigger('foo').trigger('bar');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('supports an object map of events', () => {
    const foo = vi.fn();
    const bar = vi.fn();
    $('#btn').on({ foo, bar });
    $('#btn').trigger('foo');
    expect(foo).toHaveBeenCalledTimes(1);
    expect(bar).not.toHaveBeenCalled();
  });

  it('throws without a function listener', () => {
    expect(() => $('#btn').on('click')).toThrow();
  });

  it('is chainable', () => {
    const list = $('#btn');
    expect(list.on('click', () => {})).toBe(list);
  });
});

describe('one', () => {
  it('fires only once', () => {
    const spy = vi.fn();
    $('#btn').one('ping', spy);
    $('#btn').trigger('ping').trigger('ping');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('once is an alias of one', () => {
    expect($.fn.once).toBe($.fn.one);
  });
});

describe('off', () => {
  it('removes a specific listener', () => {
    const spy = vi.fn();
    const other = vi.fn();
    $('#btn').on('ping', spy).on('ping', other);
    $('#btn').off('ping', spy);
    $('#btn').trigger('ping');
    expect(spy).not.toHaveBeenCalled();
    expect(other).toHaveBeenCalledTimes(1);
  });

  it('removes all listeners for an event name', () => {
    const spy = vi.fn();
    const other = vi.fn();
    $('#btn').on('ping', spy).on('ping', other);
    $('#btn').off('ping');
    $('#btn').trigger('ping');
    expect(spy).not.toHaveBeenCalled();
    expect(other).not.toHaveBeenCalled();
  });

  it('removes everything with no arguments', () => {
    const spy = vi.fn();
    $('#btn').on('ping', spy).on('pong', spy);
    $('#btn').off();
    $('#btn').trigger('ping').trigger('pong');
    expect(spy).not.toHaveBeenCalled();
  });

  it('supports space-separated event names', () => {
    const spy = vi.fn();
    $('#btn').on('ping pong', spy);
    $('#btn').off('ping pong');
    $('#btn').trigger('ping').trigger('pong');
    expect(spy).not.toHaveBeenCalled();
  });

  it('only removes listeners registered through jqlite bookkeeping', () => {
    const spy = vi.fn();
    $('#btn').on('ping', spy);
    $('#btn').off('ping', () => {});
    $('#btn').trigger('ping');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('trigger', () => {
  it('dispatches a bubbling event', () => {
    const spy = vi.fn();
    $(document.body).on('ping', spy);
    $('#btn').trigger('ping');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('passes args to the listener after the event', () => {
    let received = null;
    $('#btn').on('ping', (_event, a, b) => {
      received = [a, b];
    });
    $('#btn').trigger('ping', [1, 'two']);
    expect(received).toEqual([1, 'two']);
  });

  it('wraps a single non-array arg', () => {
    let received = null;
    $('#btn').on('ping', (_event, a) => {
      received = a;
    });
    $('#btn').trigger('ping', 'solo');
    expect(received).toBe('solo');
  });

  it('exposes data on the event object', () => {
    let received = null;
    $('#btn').on('ping', (event) => {
      received = event.data;
    });
    $('#btn').trigger('ping', [], { mode: 'x' });
    expect(received).toEqual({ mode: 'x' });
  });
});

describe('shorthands', () => {
  it('click(fn) attaches, click() triggers', () => {
    const spy = vi.fn();
    $('#btn').click(spy);
    $('#btn').click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('focus() and blur() move focus', () => {
    const spy = vi.fn();
    $('#field').focus(spy);
    $('#field').focus();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(document.getElementById('field'));
    $('#field').blur();
    expect(document.activeElement).not.toBe(document.getElementById('field'));
  });

  it('submit() fires submit handlers', () => {
    document.body.innerHTML = '<form id="f"><input></form>';
    const spy = vi.fn((event) => event.preventDefault());
    $('#f').submit(spy);
    $('#f').submit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('mouseenter/mouseleave/hover attach listeners', () => {
    const enter = vi.fn();
    const leave = vi.fn();
    $('#btn').hover(enter, leave);
    $('#btn').trigger('mouseenter').trigger('mouseleave');
    expect(enter).toHaveBeenCalledTimes(1);
    expect(leave).toHaveBeenCalledTimes(1);
  });
});
