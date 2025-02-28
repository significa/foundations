export const getCssValueLength = (value: string): number => {
  const temp = document.createElement("div");
  temp.setAttribute("inert", "");
  temp.style.cssText = `position:absolute;visibility:hidden;width:${value};`;
  document.body.appendChild(temp);

  const pixels = temp.offsetWidth;
  document.body.removeChild(temp);

  return pixels;
};
