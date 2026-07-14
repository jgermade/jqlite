export function isHtmlString (value) {
  return typeof value === 'string' && value.trim()[0] === '<';
}

export function fragment (html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return [...template.content.children];
}
