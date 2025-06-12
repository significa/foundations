export const scrollIntoViewIfNeeded = (
  root: HTMLElement,
  target: HTMLElement,
  options: Omit<ScrollToOptions, "left" | "top"> = {}
) => {
  const hasVerticalScroll = root.scrollHeight > root.clientHeight;
  const hasHorizontalScroll = root.scrollWidth > root.clientWidth;

  const scrollOptions: ScrollToOptions = { ...options };

  if (hasVerticalScroll) {
    scrollOptions.top = target.offsetTop - root.offsetTop;
  }

  if (hasHorizontalScroll) {
    scrollOptions.left = target.offsetLeft - root.offsetLeft;
  }

  root.scrollTo(scrollOptions);
};
