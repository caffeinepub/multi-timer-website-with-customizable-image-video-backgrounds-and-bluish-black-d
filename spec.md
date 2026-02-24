# Specification

## Summary
**Goal:** Add a play/pause button with fullscreen video playback and an optional timer overlay mode to the TickTaskTime app.

**Planned changes:**
- Add a visible play/pause button to the UI that toggles video playback on click or spacebar press, with the icon reflecting the current state.
- When video plays, enter fullscreen mode that hides all UI chrome (navigation, bottom bar, panels, controls) and shows only the video filling the entire viewport.
- Pausing the video (via button click or spacebar) exits fullscreen and restores the normal UI.
- Add a toggle/setting allowing the user to choose between two fullscreen playback modes: plain video only, or video with the currently selected timer displayed as an overlay on top.
- Persist the chosen playback mode to localStorage and restore it on reload.

**User-visible outcome:** Users can play/pause background video with a button or spacebar, watch it fullscreen with no distractions, and optionally keep their chosen timer visible as an overlay during fullscreen playback.
