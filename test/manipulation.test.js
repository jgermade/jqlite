import { beforeEach, describe, expect, it } from 'vitest';
import $ from '../src/index.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('empty', () => {
  it('removes all child nodes', () => {
    document.body.innerHTML = '<div id="box">text<span></span></div>';
    $('#box').empty();
    expect(document.getElementById('box').childNodes.length).toBe(0);
  });
});

describe('clone', () => {
  it('deep-clones by default', () => {
    document.body.innerHTML = '<div id="box"><span>hi</span></div>';
    const copy = $('#box').clone();
    expect(copy[0]).not.toBe(document.getElementById('box'));
    expect(copy[0].querySelector('span').textContent).toBe('hi');
  });

  it('clones shallowly when deep is false', () => {
    document.body.innerHTML = '<div id="box"><span></span></div>';
    expect($('#box').clone(false)[0].childNodes.length).toBe(0);
  });
});

describe('append / appendTo / prepend', () => {
  it('appends HTML strings', () => {
    document.body.innerHTML = '<div id="box"><i></i></div>';
    $('#box').append('<b>end</b>');
    expect(document.getElementById('box').lastElementChild.tagName).toBe('B');
  });

  it('moves existing elements', () => {
    document.body.innerHTML = '<div id="from"><span id="s"></span></div><div id="to"></div>';
    $('#to').append($('#s'));
    expect(document.getElementById('from').children.length).toBe(0);
    expect(document.getElementById('to').firstElementChild.id).toBe('s');
  });

  it('clones content for each target after the first', () => {
    document.body.innerHTML = '<div class="t"></div><div class="t"></div>';
    $('.t').append('<span>x</span>');
    const targets = document.querySelectorAll('.t');
    expect(targets[0].children.length).toBe(1);
    expect(targets[1].children.length).toBe(1);
  });

  it('appendTo appends the collection to the target and returns it', () => {
    document.body.innerHTML = '<div id="to"></div>';
    const list = $('<span>a</span>').appendTo('#to');
    expect(document.getElementById('to').children.length).toBe(1);
    expect(list[0].tagName).toBe('SPAN');
  });

  it('prepend inserts content first, preserving order', () => {
    document.body.innerHTML = '<div id="box"><i></i></div>';
    $('#box').prepend('<b>1</b><u>2</u>');
    const children = document.getElementById('box').children;
    expect([...children].map((el) => el.tagName).join(',')).toBe('B,U,I');
  });
});

describe('before / after', () => {
  it('inserts content before each element', () => {
    document.body.innerHTML = '<div id="box"><span id="ref"></span></div>';
    $('#ref').before('<b></b>');
    expect(document.getElementById('ref').previousElementSibling.tagName).toBe('B');
  });

  it('inserts content after each element, preserving order', () => {
    document.body.innerHTML = '<div id="box"><span id="ref"></span><i></i></div>';
    $('#ref').after('<b>1</b><u>2</u>');
    const children = document.getElementById('box').children;
    expect([...children].map((el) => el.tagName).join(',')).toBe('SPAN,B,U,I');
  });
});

describe('replaceWith', () => {
  it('replaces each element with the content', () => {
    document.body.innerHTML = '<div id="box"><span class="old"></span><span class="old"></span></div>';
    $('.old').replaceWith('<b class="new"></b>');
    const box = document.getElementById('box');
    expect(box.querySelectorAll('.old').length).toBe(0);
    expect(box.querySelectorAll('.new').length).toBe(2);
  });

  it('keeps position when replacing with multiple nodes', () => {
    document.body.innerHTML = '<div id="box"><i></i><span id="mid"></span><i></i></div>';
    $('#mid').replaceWith('<b></b><u></u>');
    const children = document.getElementById('box').children;
    expect([...children].map((el) => el.tagName).join(',')).toBe('I,B,U,I');
  });

  it('does nothing with empty content', () => {
    document.body.innerHTML = '<span id="keep"></span>';
    $('#keep').replaceWith($());
    expect(document.getElementById('keep')).not.toBeNull();
  });
});

describe('wrap', () => {
  it('wraps each element in the structure', () => {
    document.body.innerHTML = '<span class="w"></span><span class="w"></span>';
    $('.w').wrap('<div class="outer"></div>');
    expect(document.querySelectorAll('.outer > .w').length).toBe(2);
  });

  it('places elements in the innermost child of the wrapper', () => {
    document.body.innerHTML = '<span id="deep-target"></span>';
    $('#deep-target').wrap('<div class="a"><div class="b"></div></div>');
    expect(document.querySelector('.a > .b > #deep-target')).not.toBeNull();
  });

  it('accepts a function receiving the index', () => {
    document.body.innerHTML = '<span></span><span></span>';
    $('span').wrap((i) => '<div class="wrap-' + i + '"></div>');
    expect(document.querySelector('.wrap-1 > span')).not.toBeNull();
  });

  it('does not wrap detached elements', () => {
    const orphan = $('<span></span>');
    expect(() => orphan.wrap('<div></div>')).not.toThrow();
  });
});

describe('remove / detach', () => {
  it('remove drops elements from the DOM', () => {
    document.body.innerHTML = '<span></span><span></span>';
    $('span').remove();
    expect(document.querySelectorAll('span').length).toBe(0);
  });

  it('remove filters by selector', () => {
    document.body.innerHTML = '<span class="x"></span><span></span>';
    $('span').remove('.x');
    expect(document.querySelectorAll('span').length).toBe(1);
  });

  it('detach keeps data on removed elements', () => {
    document.body.innerHTML = '<span id="s"></span>';
    const list = $('#s').data('kept', 1);
    list.detach();
    expect(document.querySelectorAll('span').length).toBe(0);
    expect(list.data('kept')).toBe(1);
  });
});

describe('html', () => {
  it('gets the innerHTML of the first element', () => {
    document.body.innerHTML = '<div><b>x</b></div><div>other</div>';
    expect($('div').html()).toBe('<b>x</b>');
  });

  it('sets the innerHTML of every element', () => {
    document.body.innerHTML = '<div></div><div></div>';
    $('div').html('<i>new</i>');
    expect(document.querySelectorAll('div i').length).toBe(2);
  });

  it('accepts a function receiving (index, oldHtml)', () => {
    document.body.innerHTML = '<div>a</div><div>b</div>';
    $('div').html((i, old) => old + i);
    expect($('div').eq(1).html()).toBe('b1');
  });

  it('does not execute embedded scripts', () => {
    document.body.innerHTML = '<div></div>';
    window.__pwned = false;
    $('div').html('<script>window.__pwned = true;</script>');
    expect(window.__pwned).toBe(false);
    delete window.__pwned;
  });
});

describe('text', () => {
  it('gets the combined text of all elements', () => {
    document.body.innerHTML = '<div>a<b>b</b></div><div>c</div>';
    expect($('div').text()).toBe('abc');
  });

  it('sets the text of every element, escaping markup', () => {
    document.body.innerHTML = '<div></div>';
    $('div').text('<b>not html</b>');
    expect(document.querySelector('div').innerHTML).not.toContain('<b>');
    expect($('div').text()).toBe('<b>not html</b>');
  });

  it('accepts a function receiving (index, oldText)', () => {
    document.body.innerHTML = '<div>a</div><div>b</div>';
    $('div').text((i, old) => old.toUpperCase() + i);
    expect($('div').text()).toBe('A0B1');
  });
});
