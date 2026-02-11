# Specification

## Summary
**Goal:** Improve timer reliability across tab switches, update primary button color, add a Reminders section with local persistence, and provide an optional end-of-timer alert.

**Planned changes:**
- Update timer state management so all timer modes continue running accurately when switching between timer tabs (no pause/reset due to unmount/remount).
- Change primary/action button styling across the app to use background color `#9E1C37` (in both light and dark themes) without modifying anything under `frontend/src/components/ui`.
- Add a new top-level **Reminders** tab with a basic CRUD UI (create/view/edit/delete) for reminders containing at least a title and due date/time, persisted via `localStorage`.
- Add a Settings toggle to enable/disable end-of-timer alerts; when enabled, show an in-app alert (and/or sound) upon timer completion for relevant timer modes.

**User-visible outcome:** Timers keep correct time even when switching tabs, primary buttons appear in `#9E1C37`, a new Reminders tab allows managing locally saved reminders, and users can toggle end-of-timer alerts in Settings.
