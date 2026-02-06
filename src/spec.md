# Specification

## Summary
**Goal:** Allow users to set a YouTube video as the app background via a YouTube URL, alongside existing image/video upload and direct URL backgrounds.

**Planned changes:**
- Add a YouTube-specific background option in Background Settings where users can paste a supported YouTube URL.
- Extend the background state model to include a distinct YouTube embed media type and persist/re-hydrate it via the existing localStorage mechanism (including clear/remove behavior).
- Render an iframe-based YouTube embed as a full-viewport background behind the app UI, with minimized player UI and autoplay-muted when possible.
- Implement YouTube URL parsing/validation for common formats (watch, youtu.be, embed), extracting/storing the canonical video id and showing clear destructive errors for unsupported/invalid inputs without overwriting a working background.

**User-visible outcome:** Users can paste a valid YouTube link in Background Settings to set an embedded YouTube video as the full-screen background (persisting across refreshes), and get clear error messages when a link is invalid or unsupported.
