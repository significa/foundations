const proto = typeof Element !== 'undefined' ? Element.prototype : {};

const nativeMethod =
  // @ts-ignore
  proto.matches ||
  // @ts-ignore
  proto.matchesSelector ||
  // @ts-ignore
  proto.webkitMatchesSelector ||
  // @ts-ignore
  proto.mozMatchesSelector ||
  // @ts-ignore
  proto.msMatchesSelector ||
  // @ts-ignore
  proto.oMatchesSelector;

export function matchesQuerySelector(element: HTMLElement, selector: string): boolean {
  if (nativeMethod) {
    return nativeMethod.call(element, selector);
  }

  const nodes = element.parentNode.querySelectorAll(selector);

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] === element) {
      return true;
    }
  }

  return false;
}
