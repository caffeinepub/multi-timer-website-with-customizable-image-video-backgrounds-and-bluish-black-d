# Specification

## Summary
**Goal:** Apply the Settings panel's pink/red color theme to all toggles and buttons throughout the app, and add Spotify link support to the music feature.

**Planned changes:**
- Update all toggle switches app-wide to use the pink/red color scheme from the Settings panel (pink track when off, crimson/red when on, matching thumb styling)
- Update all action buttons in `TimerVisibilityBar` (Tasks, Show Timer, Alerts, etc.) to use the same pink background with red/crimson text or red background with white text as seen in Settings
- Add Spotify URL detection and conversion to embeddable iframe format in `musicSupport.ts`
- Render a Spotify embed iframe in `MusicStage.tsx` when a Spotify URL is detected
- Update placeholder/help text in `MusicSettings.tsx` to mention Spotify as a supported source

**User-visible outcome:** All toggles and buttons across the app share the same pink/red visual style as the Settings panel, and users can paste Spotify track, album, or playlist URLs into the music input to have them embedded and played inline.
