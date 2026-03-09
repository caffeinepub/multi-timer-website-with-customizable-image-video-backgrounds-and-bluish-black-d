# ticktocktask

## Current State
The app has a global light pink / dark red theme applied via CSS tokens and inline styles. The Settings, Share, Tasks panels, and bottom bar all use `--settings-pink` / `--settings-crimson` token variables. The current background token `--background` is set to `0.955 0.025 5` (OKLCH) and `--banner` matches it. The `SoundCustomizationPanel` toggle button and panel use generic `bg-background` / `text-foreground` classes rather than the pink/crimson theme. Timer card areas use standard background.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Update `--background` CSS token to match a light pink hex `#FFFFF7` (very pale pink-cream, OKLCH approx `0.999 0.005 350`) — wait, user said `#FFFFF7` in earlier message but the latest request is to apply light pink like the Settings panel to everything
- Apply the same light pink background color (`--settings-pink` / `oklch(0.965 0.018 5)`) and dark red text (`--settings-crimson` / `oklch(0.35 0.145 12)`) consistently everywhere:
  - `--background` token → light pink `oklch(0.965 0.018 5)`
  - `--foreground` token → dark red `oklch(0.35 0.145 12)`
  - `--card` → same light pink
  - `--card-foreground` → dark red
  - `--popover` / `--popover-foreground` → light pink / dark red
  - `--border` → subtle pink `oklch(0.88 0.03 8)`
  - `--muted` / `--muted-foreground` → light pink / medium red
  - `SoundCustomizationPanel` toggle button and panel: swap generic classes to use `bg-settings-pink text-settings-crimson border-settings-crimson/20`
  - SoundCustomizationPanel `DialogContent` for Add Custom Sound: set `bg-settings-pink` background and `text-settings-crimson` text
  - Timer cards and all container divs using `bg-background` will naturally inherit the pink via the token
  - Bottom bar (`TimerVisibilityBar`): already using `bg-background` so will inherit

### Remove
- Nothing

## Implementation Plan
1. Update `index.css` `:root` tokens: `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--secondary`, `--secondary-foreground`, `--border`, `--input`, `--banner` all tuned to the light pink / dark red palette
2. Update `SoundCustomizationPanel.tsx`: toggle button and panel wrapper to use settings-pink/crimson classes; DialogContent for Add Sound to use `className` with `bg-settings-pink text-settings-crimson`
3. Validate build
