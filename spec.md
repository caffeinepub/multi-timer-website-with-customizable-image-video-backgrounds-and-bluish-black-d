# Specification

## Summary
**Goal:** Fix the settings dialog title so it dynamically reflects the currently active tab, specifically showing "Share" (not "Settings") when the Share tab is selected.

**Planned changes:**
- Update the dialog title and subtitle to change dynamically based on the selected tab
- When the "Share" tab is active, display "Share" as the title with an appropriate subtitle
- All other tabs (Background, Music, Alerts, Timer Tabs) continue to show their appropriate titles without regression

**User-visible outcome:** When the user clicks the "Share" tab in the settings dialog, the dialog header now reads "Share" instead of "Settings".
