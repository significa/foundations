export const scrollIntoViewIfNeeded = (
  element: HTMLElement,
  target: HTMLElement,
  options: Omit<ScrollToOptions, "left" | "top"> = {}
) => {
  const hasVerticalScroll = element.scrollHeight > element.clientHeight;
  const hasHorizontalScroll = element.scrollWidth > element.clientWidth;

  const scrollOptions: ScrollToOptions = { ...options };

  if (hasVerticalScroll) {
    scrollOptions.top = target.offsetTop - element.offsetTop;
  }

  if (hasHorizontalScroll) {
    scrollOptions.left = target.offsetLeft - element.offsetLeft;
  }

  element.scrollTo(scrollOptions);
};
