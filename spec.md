# TickTockTask

## Current State
The app has a YouTube background player that embeds an iframe filling the entire viewport. The YouTube iframe, even with `modestbranding`, shows a thin title bar at the top ("You're lost in an enchanted forest | Piano Playlist") that bleeds through because the iframe top edge aligns exactly with the viewport top. The timer panels also appear over the video in a cluttered way when "Show Timer" is toggled on.

## Requested Changes (Diff)

### Add
- Nothing new to add

### Modify
- YouTubeBackgroundPlayer: position the iframe container so the iframe overflows upward (negative top offset) to hide the YouTube title bar that appears at the top. The iframe should cover more than 100% height and be centered vertically so both top and bottom YouTube UI elements are clipped outside the viewport.
- BackgroundStage: ensure the YouTube container wrapper has `overflow: hidden` to clip the overflowing iframe properly.
- The bottom black strip in YouTubeBackgroundPlayer (currently 8px) can be removed since the overflow approach handles it.

### Remove
- Nothing to remove

## Implementation Plan
1. In YouTubeBackgroundPlayer, change the inner iframe container positioning so the wrapper div uses `position: absolute; top: -60px; left: 0; right: 0; bottom: -60px` (or similar negative inset) to push the YouTube title bar and bottom bar outside the clipping area.
2. Update the parent container in BackgroundStage to use `overflow: hidden` on the YouTube wrapper div.
3. Remove the black bottom strip overlay since overflow handles it.
