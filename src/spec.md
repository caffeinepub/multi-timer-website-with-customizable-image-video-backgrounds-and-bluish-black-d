# Specification

## Summary
**Goal:** Let users set Interval Timer durations using minutes + seconds (while keeping internal storage in total seconds), and make the Publish & Share flow clearer for going live.

**Planned changes:**
- Update Interval Timer configuration for Interval A and Interval B to use separate numeric inputs for minutes and seconds (instead of seconds-only), while storing and running the timer based on total seconds.
- Ensure existing saved interval values (stored as seconds) load and display correctly as decomposed minutes/seconds.
- Keep interval inputs disabled while the timer is running (consistent with current behavior).
- Adjust validation/clamping for minute-based entry: seconds clamped to 0–59, minutes non-negative with a reasonable upper bound, and total duration must be at least 1 second.
- Ensure countdown display remains correct for longer intervals (e.g., MM:SS or HH:MM:SS).
- Improve Publish & Share sheet guidance with clearer English copy distinguishing preview/draft URL vs public URL, including a short go-live checklist and an iframe-preview warning that directs users to the Live tab’s Go live button.

**User-visible outcome:** Users can configure Interval A/B using minutes and seconds, use longer intervals safely with correct countdown formatting, and follow clearer in-app guidance to publish a public URL from the Publish & Share sheet.
