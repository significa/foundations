# Roadmap

This file contains missing components and a list of things we would like to improve in Foundations.
Some items will be impossible to do until there is decent baseline support for them. We will write them here nonetheless so the path forward is clear.

## Improvements

- [ ] As soon as native CSS allows, drop `floating-ui` in favor of native platform solutions. We need everything floating-ui provides to be baseline (different anchoring positions, position fallback, focus trapping, etc.). This is the single most complex part of the code and we would gain a lot if we could make it simpler and leaned more into the platform.
- [ ] Remove TextareaResize in favour of `field-sizing: content` as soon as it's baseline.
- [ ] Select VS Listbox. If styling selects is baseline we should try to see if Listbox can be replaced by more customisation in the native Select component.
- [ ] Drag to dismiss drawer (at least on mobile).

## Missing components

- [ ] Toggle Button
- [ ] File upload
- [ ] CMD K
- [ ] Data Table
- [ ] Spinner variants. Instead of doing just the same spinning circle, we should move into having a Loader with more options. Pulsing dots, plain ascii, etc. We can have interesting variants that can fit better with different design systems.
