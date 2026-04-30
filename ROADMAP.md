# Roadmap

This file contains missing components and a list of things we would like to improve in Foundations.
Some items will be impossible to do until there is decent baseline support for them. We will write them here nonetheless so the path forward is clear.

## Improvements

- [ ] Compute border-radius from a base radius CSS var (like tailwind v4 does with its spacing). Changing that value would define the "roundness" of the overall look and feel of the design system. Some components (like dropdown items) have a panel and inside items. The radius of the inside items needs to be calculated from the outer radius so it follows the curve perfectly. (see https://bettercorners.io/ for reference)
- [ ] Verify if our minimal set of semantic tokens are good and enough or if we should introduce things like "error", "warning" and "success".
- [ ] Relates with the above, but guarantee that the ergonomics of moving foundations components over to new and existing design systems and updating their style is as good as it gets when it comes to DX and flexibility. Currently we rely a lot on find and replace but we've been seeing that most of the times we miss a thing here and there causing the design system to become inconsistent.
- [ ] As soon as native CSS allows, drop `floating-ui` in favor of native platform solutions. We need everything floating-ui provides to be baseline (different anchoring positions, position fallback, focus trapping, etc.). This is the single most complex part of the code and we would gain a lot if we could make it simpler and leaned more into the platform.
- [ ] Remove TextareaResize in favour of `field-sizing: content` as soon as it's baseline.
- [ ] Forms. We have an article at @guides/acessible-forms that goes in depth in how we should build things to make accessible forms with the best DX possible. The content is good but the ergonomics aren't right (it requires us to update every field to add a `useField` hook to provide the correct attributes). We should take a look at how other libraries do this (e.g.: ShadCN) and improve our approach.
- [ ] Select VS Listbox. If styling selects is baseline we should try to see if Listbox can be replaced by more customisation in the native Select component.
- [ ] Tabs: Another variant to make them more flexible would be nice. Currently this style is a bit opinionated. Also, we sometimes have a bug where the `motion` element with `layoutId` transitions when it should not (e.g.: when navigating between pages with different tab components)

## Missing components

- [ ] Pagination
- [ ] Breadcrumb
- [ ] Toggle Button
- [ ] File upload
- [ ] CMD K
- [ ] Kbd
- [ ] Data Table
- [ ] Spinner variants. Instead of doing just the same spinning circle, we should move into having a Loader with more options. Pulsing dots, plain ascii, etc. We can have interesting variants that can fit better with different design systems.
