import { jqlite as $ } from '../jqlite.js';
import { ListDOM } from '../list-dom.js';
import { isFunction } from '../internal/type-checks.js';

// Content is cloned for every target after the first, so each target gets its
// own copy while the original nodes land in the first target (jQuery behavior).
function contentFor (jContent, index) {
  return index ? jContent.clone() : jContent;
}

export default {
  empty () {
    return this.each((_i, element) => element.replaceChildren());
  },

  clone (deep) {
    deep = deep === undefined || !!deep;
    const list = new ListDOM();
    for (const element of this) {
      list.push(element.cloneNode(deep));
    }
    return list;
  },

  append (content) {
    const jContent = $(content);
    return this.each((i, element) => element.append(...contentFor(jContent, i)));
  },

  appendTo (target) {
    $(target).append(this);
    return this;
  },

  prepend (content) {
    const jContent = $(content);
    return this.each((i, element) => element.prepend(...contentFor(jContent, i)));
  },

  before (content) {
    const jContent = $(content);
    return this.each((i, element) => element.before(...contentFor(jContent, i)));
  },

  after (content) {
    const jContent = $(content);
    return this.each((i, element) => element.after(...contentFor(jContent, i)));
  },

  replaceWith (content) {
    const jContent = $(content);
    if (!jContent.length) return this;
    for (let i = this.length - 1; i >= 0; i--) {
      this[i].replaceWith(...contentFor(jContent, i));
    }
    return this;
  },

  wrap (content) {
    return this.each((i, element) => {
      if (!element.parentNode) return;
      const wrapper = $(isFunction(content) ? content.call(element, i) : content).clone()[0];
      if (!wrapper) return;
      let innermost = wrapper;
      while (innermost.firstElementChild) {
        innermost = innermost.firstElementChild;
      }
      element.replaceWith(wrapper);
      innermost.appendChild(element);
    });
  },

  remove (selector) {
    const list = selector ? this.filter(selector) : this;
    for (const element of list) {
      element.remove();
    }
    return this;
  },

  detach (selector) {
    return this.remove(selector);
  },

  html (html) {
    if (html === undefined) {
      return this[0] ? this[0].innerHTML : undefined;
    }
    if (isFunction(html)) {
      return this.each((i, element) => {
        element.innerHTML = html.call(element, i, element.innerHTML);
      });
    }
    return this.each((_i, element) => {
      element.innerHTML = html;
    });
  },

  text (text) {
    if (text === undefined) {
      let result = '';
      for (const element of this) {
        result += element.textContent;
      }
      return result;
    }
    if (isFunction(text)) {
      return this.each((i, element) => {
        element.textContent = text.call(element, i, element.textContent);
      });
    }
    return this.each((_i, element) => {
      element.textContent = text;
    });
  }
};
