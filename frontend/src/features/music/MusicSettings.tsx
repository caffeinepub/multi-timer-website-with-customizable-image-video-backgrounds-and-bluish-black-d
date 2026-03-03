import { useState } from 'react';
import { useMusicContext } from './MusicProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Music, X, Volume2 } from 'lucide-react';
import { SiSpotify, SiApplemusic } from 'react-icons/si';

export function MusicSettings() {
  const { sourceUrl, sourceType, error, volume, setMusicSource, clearMusic, setVolume } = useMusicContext();
  const [urlInput, setUrlInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!urlInput.trim()) {
      setLocalError('Please enter a valid URL');
      return;
    }

    setLocalError(null);
    setMusicSource(urlInput.trim());
    setUrlInput('');
  };

  const handleClear = () => {
    clearMusic();
    setUrlInput('');
    setLocalError(null);
  };

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0] / 100);
  };

  const isMusicActive = sourceUrl && !error;
  const isEmbedPlayer = sourceType === 'spotify' || sourceType === 'apple';

  return (
    <div className="space-y-4 text-settings-crimson">
      {(error || localError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || localError}</AlertDescription>
        </Alert>
      )}

      {isMusicActive && (
        <div className="rounded-lg border border-settings-crimson/30 bg-settings-pink-active p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-settings-crimson">Music active</p>
              <p className="text-xs text-settings-crimson/70 flex items-center gap-1.5">
                {sourceType === 'spotify' && <SiSpotify className="h-3.5 w-3.5 text-green-600" />}
                {sourceType === 'apple' && <SiApplemusic className="h-3.5 w-3.5 text-pink-600" />}
                {sourceType === 'spotify' ? 'Spotify' : sourceType === 'apple' ? 'Apple Music' : 'Direct audio'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-settings-crimson hover:text-settings-crimson hover:bg-settings-pink"
            >
              <X className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="music-url" className="text-settings-crimson">Music URL</Label>
          <div className="flex gap-2">
            <Input
              id="music-url"
              type="url"
              placeholder="Spotify, Apple Music, or direct audio link"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="border-settings-crimson/30 text-settings-crimson placeholder:text-settings-crimson/40"
            />
            <Button
              onClick={handleSubmit}
              className="bg-settings-crimson text-white hover:bg-settings-crimson-hover border-0"
            >
              <Music className="mr-2 h-4 w-4" />
              Set
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-settings-crimson/70">
              Supported sources:
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-settings-crimson/70 bg-settings-pink-active rounded px-2 py-0.5 border border-settings-crimson/20">
                <SiSpotify className="h-3 w-3 text-green-600" />
                Spotify (open.spotify.com)
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-settings-crimson/70 bg-settings-pink-active rounded px-2 py-0.5 border border-settings-crimson/20">
                <SiApplemusic className="h-3 w-3 text-pink-600" />
                Apple Music
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-settings-crimson/70 bg-settings-pink-active rounded px-2 py-0.5 border border-settings-crimson/20">
                <Music className="h-3 w-3" />
                Direct audio (.mp3, .wav, .ogg, .m4a)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="music-volume" className="flex items-center gap-2 text-settings-crimson">
              <Volume2 className="h-4 w-4" />
              Volume
            </Label>
            <span className="text-sm text-settings-crimson/70">{Math.round(volume * 100)}%</span>
          </div>
          <Slider
            id="music-volume"
            min={0}
            max={100}
            step={1}
            value={[volume * 100]}
            onValueChange={handleVolumeChange}
            className="w-full [&_[data-slot=slider-track]]:bg-settings-crimson/20 [&_[data-slot=slider-range]]:bg-settings-crimson [&_[data-slot=slider-thumb]]:bg-settings-crimson [&_[data-slot=slider-thumb]]:border-settings-crimson"
          />
          {isEmbedPlayer && (
            <p className="text-xs text-settings-crimson/60">
              Note: Volume control may not work for embedded players. Use the player's built-in volume control if needed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
