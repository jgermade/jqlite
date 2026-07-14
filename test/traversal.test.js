import { beforeEach, describe, expect, it } from 'vitest';
import $ from '../src/index.js';

beforeEach(() => {
  document.body.innerHTML = `
    <ul id="list">
      <li id="a" class="odd">a</li>
      <li id="b" class="even">b</li>
      <li id="c" class="odd">c</li>
      <li id="d" class="even">d</li>
    </ul>
    <div id="wrapper">
      <p class="odd">paragraph</p>
      <div class="deep"><span class="leaf"></span></div>
    </div>
  `;
});

describe('get', () => {
  it('returns the element at an index', () => {
    expect($('li').get(1)).toBe(document.getElementById('b'));
  });

  it('supports negative indexes', () => {
    expect($('li').get(-1)).toBe(document.getElementById('d'));
  });

  it('returns a plain array with no arguments', () => {
    const all = $('li').get();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBe(4);
    expect(all[0]).toBe(document.getElementById('a'));
  });

  it('returns undefined out of bounds', () => {
    expect($('li').get(10)).toBeUndefined();
  });
});

describe('eq', () => {
  it('returns a single-element collection', () => {
    const list = $('li').eq(2);
    expect(list.length).toBe(1);
    expect(list[0]).toBe(document.getElementById('c'));
  });

  it('counts backward from the last element for negative indexes', () => {
    expect($('li').eq(-1)[0]).toBe(document.getElementById('d'));
    expect($('li').eq(-4)[0]).toBe(document.getElementById('a'));
  });

  it('returns an empty collection out of bounds', () => {
    expect($('li').eq(9).length).toBe(0);
    expect($('li').eq(-9).length).toBe(0);
  });
});

describe('first / last', () => {
  it('first returns the first element', () => {
    const list = $('li').first();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe('a');
  });

  it('last returns the last element', () => {
    const list = $('li').last();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe('d');
  });

  it('both are empty on empty collections', () => {
    expect($('nope').first().length).toBe(0);
    expect($('nope').last().length).toBe(0);
  });
});

describe('find', () => {
  it('finds descendants', () => {
    expect($('#wrapper').find('span').length).toBe(1);
    expect($('body').find('li').length).toBe(4);
  });

  it('supports the "> selector" direct-child shorthand', () => {
    expect($('#wrapper').find('> p').length).toBe(1);
    expect($('#wrapper').find('> span').length).toBe(0);
  });

  it('deduplicates results across the collection', () => {
    expect($('body, #wrapper').find('.leaf').length).toBe(1);
  });

  it('returns the collection itself without a selector', () => {
    const list = $('li');
    expect(list.find()).toBe(list);
  });
});

describe('add', () => {
  it('merges selections without duplicates', () => {
    const list = $('.odd').add('.even').add('#a');
    expect(list.length).toBe(5);
  });
});

describe('each', () => {
  it('iterates with (index, element) and element as this', () => {
    const seen = [];
    const list = $('li');
    const result = list.each(function (i, el) {
      expect(this).toBe(el);
      seen.push(i + ':' + el.id);
    });
    expect(result).toBe(list);
    expect(seen).toEqual(['0:a', '1:b', '2:c', '3:d']);
  });
});

describe('filter', () => {
  it('filters by selector', () => {
    const list = $('li').filter('.odd');
    expect(list.length).toBe(2);
    expect(list[0].id).toBe('a');
  });

  it('filters by function with (index, element) and element as this', () => {
    const list = $('li').filter(function (i, el) {
      expect(this).toBe(el);
      return i % 2 === 0;
    });
    expect(list.length).toBe(2);
    expect(list[1].id).toBe('c');
  });
});

describe('closest', () => {
  it('returns the closest matching ancestor or self', () => {
    expect($('.leaf').closest('#wrapper')[0].id).toBe('wrapper');
    expect($('.leaf').closest('.leaf')[0].className).toBe('leaf');
  });

  it('deduplicates shared ancestors', () => {
    expect($('li').closest('ul').length).toBe(1);
  });

  it('returns empty when nothing matches', () => {
    expect($('.leaf').closest('table').length).toBe(0);
  });
});

describe('children', () => {
  it('returns element children', () => {
    expect($('#list').children().length).toBe(4);
  });

  it('filters by selector', () => {
    expect($('#list').children('.even').length).toBe(2);
  });
});

describe('parent', () => {
  it('returns unique parents', () => {
    const parents = $('li').parent();
    expect(parents.length).toBe(1);
    expect(parents[0].id).toBe('list');
  });

  it('filters by selector', () => {
    expect($('li').parent('div').length).toBe(0);
    expect($('li').parent('ul').length).toBe(1);
  });
});

describe('contents', () => {
  it('returns child nodes including text nodes', () => {
    document.body.innerHTML = '<div id="mix">text<span></span>more</div>';
    const nodes = $('#mix').contents();
    expect(nodes.length).toBe(3);
    expect(nodes[0].nodeType).toBe(3);
    expect(nodes[1].nodeType).toBe(1);
  });
});

describe('next / nextAll', () => {
  it('next returns the following sibling', () => {
    expect($('#a').next()[0].id).toBe('b');
    expect($('#d').next().length).toBe(0);
  });

  it('next filters by selector', () => {
    expect($('#a').next('.even')[0].id).toBe('b');
    expect($('#a').next('.odd').length).toBe(0);
  });

  it('nextAll returns all following siblings', () => {
    const list = $('#b').nextAll();
    expect(list.map((el) => el.id).join(',')).toBe('c,d');
  });

  it('nextAll filters and deduplicates', () => {
    expect($('#a').nextAll('.even').length).toBe(2);
    expect($('li').nextAll().length).toBe(3);
  });
});

describe('prev / prevAll', () => {
  it('prev returns the preceding sibling', () => {
    expect($('#b').prev()[0].id).toBe('a');
    expect($('#a').prev().length).toBe(0);
  });

  it('prevAll returns preceding siblings, closest first', () => {
    const list = $('#d').prevAll();
    expect(list.map((el) => el.id).join(',')).toBe('c,b,a');
  });

  it('prevAll filters by selector', () => {
    expect($('#d').prevAll('.odd').length).toBe(2);
  });
});
