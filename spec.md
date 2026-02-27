# Specification

## Summary
**Goal:** Add a "ping" alarm sound option and a volume control slider to the sound customization panel.

**Planned changes:**
- Add a "Ping" sound option to the alert sound selector, synthesized via the Web Audio API (no external audio files), and ensure it can be previewed from the alert settings UI
- Register the ping tone in `alertSounds.ts` and implement tone generation in the `playAlertSound` utility
- Add a volume slider to `SoundCustomizationPanel` that controls playback volume for custom sound previews in real time
- Persist the volume setting to localStorage and apply it whenever a sound is played via `CustomSoundsProvider`

**User-visible outcome:** Users can select a "Ping" tone as their timer alarm sound, and a volume slider in the sound panel lets them adjust and persist the playback volume for custom sounds.
