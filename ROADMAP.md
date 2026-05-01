# Roadmap

This file contains missing components and a list of things we would like to improve in Foundations.
Some items will be impossible to do until there is decent baseline support for them. We will write them here nonetheless so the path forward is clear.

## Improvements

- [ ] As soon as native CSS allows, drop `floating-ui` in favor of native platform solutions. We need everything floating-ui provides to be baseline (different anchoring positions, position fallback, focus trapping, etc.). This is the single most complex part of the code and we would gain a lot if we could make it simpler and leaned more into the platform.
- [ ] Remove TextareaResize in favour of `field-sizing: content` as soon as it's baseline.
- [ ] Select VS Listbox. If styling selects is baseline we should try to see if Listbox can be replaced by more customisation in the native Select component.
- [ ] Drag to dismiss drawer (at least on mobile).
- [ ] EPIC: React Native. We have a lot of projects in React Native with seriously good design systems (reanimated instead of motion). Check our codebases and plan this.
- [ ] check if the radii scale is good as is or if we should use something like fibonnaci or golden ratio.
- [ ] IDEA: most times we copy the components and then scroll through all the lines finding places to edit the style. should we extract and move up in the component the style definition (classnames)? should we do it just for the style that's usually updated and leave the functional style inline? is this something that will make the components more complex for marginal gains?

## Missing components

_None — `Table` ships the styled primitive, with a documented TanStack Table recipe for full data-table functionality. Heavy data-grid features (virtualization, pivot, range selection) are intentionally out of scope; reach for AG Grid / LyteNyte if you need them._
