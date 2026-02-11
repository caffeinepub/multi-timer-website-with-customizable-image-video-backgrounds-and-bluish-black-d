# Specification

## Summary
**Goal:** Prevent the app from booting into a blocking background error state when a persisted background (image/video/YouTube) can’t load, by auto-clearing the broken background and providing an in-overlay recovery action.

**Planned changes:**
- On app start, validate the persisted background configuration and attempt a lightweight load/initialize; if it fails (unreachable/unsupported image/video URL or failing YouTube video), automatically clear the persisted background so the app renders normally.
- Update background persistence so transient runtime load errors from the background stage do not get saved in a way that causes repeated error overlays after refresh.
- Add a recovery control to the background error overlay (e.g., “Clear background”) that clears the current background and dismisses the overlay for image, video, and YouTube error states.

**User-visible outcome:** If a saved background can’t be loaded, the app will automatically reset to no background and load normally; if an error overlay appears, users can click “Clear background” to recover immediately and a refresh won’t re-trigger the same stuck error state.
