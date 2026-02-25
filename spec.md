# Specification

## Summary
**Goal:** Fix the "hide timer" toggle so that toggling timer visibility does not reset or restart any running timer.

**Planned changes:**
- Ensure the `TimerVisibilityBar` hide/show toggle only controls the visual display of the timer panel, with no effect on timer state (elapsed time, running status, remaining time)
- Fix the bug where toggling timer visibility causes running timers (countdown, stopwatch, pomodoro, interval, repeating) to restart or reset

**User-visible outcome:** Users can hide and re-show the timer panel while a timer is running, and the timer continues uninterrupted — displaying the correct current time when the panel is revealed again.
