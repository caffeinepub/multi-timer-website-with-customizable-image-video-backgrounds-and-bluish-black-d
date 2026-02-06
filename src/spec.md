# Specification

## Summary
**Goal:** Make active background video/image/YouTube appear as close to the original source as possible (clear and bright) by removing any app-side dimming/blur effects while keeping the timer UI readable.

**Planned changes:**
- Remove or reduce to effectively zero any global full-screen darkening/blur overlay applied in `BackgroundStage` when a background is active and no error is shown.
- Audit and remove unintended visual degradation on background media elements (e.g., CSS filters, opacity reductions, layering artifacts) so video/image/YouTube renders at full clarity.
- Preserve readability by relying on existing UI surfaces (e.g., header/footer/cards) rather than reintroducing a noticeable full-screen overlay; keep the error screen visually distinct/readable when background fails.

**User-visible outcome:** Backgrounds (image, video, and YouTube) display essentially as bright and clear as their original media, with the timer UI still readable and error states still clearly presented.
