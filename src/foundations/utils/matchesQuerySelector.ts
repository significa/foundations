const proto = typeof Element !== 'undefined' ? Element.prototype : {};

const nativeMethod =
  // @ts-expect-error
  proto.matches ||
  // @ts-expect-error
  proto.matchesSelector ||
  // @ts-expect-error
  proto.webkitMatchesSelector ||
  // @ts-expect-error
  proto.mozMatchesSelector ||
  // @ts-expect-error
  proto.msMatchesSelector ||
  // @ts-expect-error
  proto.oMatchesSelector;

export function matchesQuerySelector(element: HTMLElement, selector: string): boolean {
  if (nativeMethod) {
    return nativeMethod.call(element, selector);
  }

  const nodes = element.parentNode.querySelectorAll(selector);

  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i] === element) {
      return true;
    }
  }

  return false;
}
