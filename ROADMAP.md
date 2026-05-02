# Roadmap

This file contains missing components and a list of things we would like to improve in Foundations.
Some items will be impossible to do until there is decent baseline support for them. We will write them here nonetheless so the path forward is clear.

## Improvements

- [ ] Size scale calibration — Default `md` is biased toward marketing/e-commerce density; productivity-style projects consistently reach for `sm`. Investigated shifting the scale; every approach has a real cost. Main blocker now is mobile auto-zoom on inputs smaller than 16px. If we solve that we can proceed and shift everything
- [ ] As soon as native CSS allows, drop `floating-ui` in favor of native platform solutions. We need everything floating-ui provides to be baseline (different anchoring positions, position fallback, focus trapping, etc.). This is the single most complex part of the code and we would gain a lot if we could make it simpler and leaned more into the platform.
- [ ] Remove TextareaResize in favour of `field-sizing: content` as soon as it's baseline.
- [ ] Select VS Listbox. If styling selects is baseline we should try to see if Listbox can be replaced by more customisation in the native Select component.
- [ ] Drag to dismiss drawer (at least on mobile).
- [ ] EPIC: React Native (completely different route, but same codebase?). We have a lot of projects in React Native with seriously good design systems (reanimated instead of motion). Check our codebases and plan this.

## Missing components

- [ ] **Progress** — linear and circular variants. The pattern already exists inline in `FileUpload`; extract it to its own primitive and have FileUpload consume it.
- [ ] **Number Input** — input with stepper buttons, keyboard increment/decrement, min/max/step. We hit this need regularly across apps.

## Non-goals

Things we have intentionally decided _not_ to build, so we don't re-litigate them. If you think one of these is wrong, open the conversation — but the bar is high.

- **Headless / styled split.** Foundations is consumed by copy-paste; styles are simple enough to update in place. The trade-off is that classnames are scattered through the components, but that's the price of owning the surface area instead of relying on Radix or Base UI — a trade we think is worth it. Floating UI is our only meaningful dependency, by design.
- **Tag input (chips inside the input).** Render chips outside the input instead. The "chips inside" pattern has too many edge cases around editing, keyboard navigation, and selection, and there is almost always a clearer pattern (input + chips above/below).
- **Combobox as a dedicated primitive.** Our existing pattern of an Input rendered inside a Popover above a Listbox already covers searchable-select use cases. If the recipe needs to be more discoverable in the docs, that's a docs problem, not a primitive problem.
- **Hover Card.** Use Tooltip for hint-style content, or compose Popover with hover triggers when you need richer content. A third primitive doesn't earn its slot.
- **Context Menu, Menubar, Navigation Menu, Toolbar.** All compositional. Build them from the primitives we ship (Menu, Toggle, etc.). If roving-focus turns out to be the recurring pain, a `useRovingFocus` hook is the right unit — not a wrapper component.
- **Alert Dialog.** Modal already covers this. Don't split.
- **Aspect Ratio, Card.** Too trivial or too opinionated to earn a primitive slot.
- **Tree, Resizable Panels, Scroll Area.** Niche or covered well by the platform / userland. Add only if a real project demands it.
