# Specification

## Summary
**Goal:** Add a fullscreen toggle button that fills the entire screen with the user's currently active background.

**Planned changes:**
- Add a fullscreen button (fixed/floating in the UI) that is only visible when a background (image, video, or YouTube) is active.
- Clicking the button triggers the browser's native Fullscreen API on the background stage element.
- The button toggles its icon/label to indicate "exit fullscreen" when already in fullscreen mode.
- Pressing Escape or clicking the button again exits fullscreen and returns to the normal app layout.

**User-visible outcome:** Users with an active background can click a fullscreen button to have their chosen background fill the entire screen, and click again (or press Escape) to exit fullscreen.
