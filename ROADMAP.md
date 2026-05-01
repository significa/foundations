# Roadmap

This file contains missing components and a list of things we would like to improve in Foundations.
Some items will be impossible to do until there is decent baseline support for them. We will write them here nonetheless so the path forward is clear.

## Improvements

- [ ] As soon as native CSS allows, drop `floating-ui` in favor of native platform solutions. We need everything floating-ui provides to be baseline (different anchoring positions, position fallback, focus trapping, etc.). This is the single most complex part of the code and we would gain a lot if we could make it simpler and leaned more into the platform.
- [ ] Remove TextareaResize in favour of `field-sizing: content` as soon as it's baseline.
- [ ] Select VS Listbox. If styling selects is baseline we should try to see if Listbox can be replaced by more customisation in the native Select component.
- [ ] Drag to dismiss drawer (at least on mobile).
- [ ] Schemes: instead of just changing accent, allow for the DS panel to define complete themes. We could have a few presets and as a stretch-goal allow to create custom themes in the ds panel itself. Requires good and clever UX.
- [ ] EPIC: React Native. We have a lot of projects in React Native with seriously good design systems (reanimated instead of motion). Check our codebases and plan this.

## Missing components

- [ ] File upload
- [ ] CMD K
- [ ] Data Table
- [ ] Menu - mainly because of nested menus (linear-style). Careful, lots of overlapping concern with existing Dropdown. Probably worth it to consider merging all of this into one, if possible
