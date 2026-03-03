import { useState, useRef } from 'react';
import { useBackgroundContext } from './BackgroundProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Upload, Link as LinkIcon, X, Loader2, Volume2, Sun, Layers } from 'lucide-react';
import { SiYoutube } from 'react-icons/si';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { inferMediaType } from './mediaSupport';

export function BackgroundCustomizer() {
  const { 
    backgroundUrl, 
    youtubeVideoId, 
    mediaType, 
    youtubeVolume,
    brightness,
    showTimerOverlay,
    setBackgroundFromFile, 
    setBackgroundFromUrl, 
    setBackgroundFromYouTubeUrl, 
    setYouTubeVolume,
    setBrightness,
    toggleTimerOverlay,
    clearBackground, 
    error, 
    isProbing 
  } = useBackgroundContext();
  const [urlInput, setUrlInput] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError(null);
    const mediaTypeInferred = inferMediaType(file.type);
    
    if (!mediaTypeInferred) {
      setLocalError('Unsupported file type. Please select an image or video file.');
      return;
    }

    setBackgroundFromFile(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileInputClick = () => {
    setLocalError(null);
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) {
      setLocalError('Please enter a valid URL');
      return;
    }

    setLocalError(null);
    await setBackgroundFromUrl(urlInput.trim());
    setUrlInput('');
  };

  const handleYouTubeSubmit = () => {
    if (!youtubeInput.trim()) {
      setLocalError('Please enter a YouTube URL');
      return;
    }

    setLocalError(null);
    setBackgroundFromYouTubeUrl(youtubeInput.trim());
    setYoutubeInput('');
  };

  const handleClear = () => {
    clearBackground();
    setUrlInput('');
    setYoutubeInput('');
    setLocalError(null);
  };

  const handleVolumeChange = (values: number[]) => {
    setYouTubeVolume(values[0]);
  };

  const handleBrightnessChange = (values: number[]) => {
    setBrightness(values[0]);
  };

  const isBackgroundActive = (backgroundUrl || youtubeVideoId) && !error;
  const isYouTubeActive = mediaType === 'youtube' && youtubeVideoId && !error;
  const isVideoBackground = (mediaType === 'video' || mediaType === 'youtube') && isBackgroundActive;

  // Crimson slider style override
  const crimsonSliderStyle = {
    '--slider-track-color': 'oklch(var(--settings-crimson))',
    '--slider-range-color': 'oklch(var(--settings-crimson))',
    '--slider-thumb-color': 'oklch(var(--settings-crimson))',
  } as React.CSSProperties;

  return (
    <div className="space-y-4 text-settings-crimson">
      {(error || localError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || localError}</AlertDescription>
        </Alert>
      )}

      {isBackgroundActive && (
        <div className="rounded-lg border border-settings-crimson/30 bg-settings-pink-active p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-settings-crimson">Background active</p>
              <p className="text-xs text-settings-crimson/70">
                {mediaType === 'youtube' ? 'YouTube video' : mediaType === 'video' ? 'Video' : 'Image'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-settings-crimson hover:text-settings-crimson hover:bg-settings-pink"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {isBackgroundActive && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="background-brightness" className="flex items-center gap-2 text-settings-crimson">
              <Sun className="h-4 w-4" />
              Background brightness
            </Label>
            <span className="text-sm text-settings-crimson/70">{brightness ?? 100}%</span>
          </div>
          <div style={crimsonSliderStyle}>
            <Slider
              id="background-brightness"
              min={0}
              max={100}
              step={1}
              value={[brightness ?? 100]}
              onValueChange={handleBrightnessChange}
              className="w-full [&_[data-slot=slider-track]]:bg-settings-crimson/20 [&_[data-slot=slider-range]]:bg-settings-crimson [&_[data-slot=slider-thumb]]:bg-settings-crimson [&_[data-slot=slider-thumb]]:border-settings-crimson"
            />
          </div>
          <p className="text-xs text-settings-crimson/60">
            Adjust the brightness of the background
          </p>
        </div>
      )}

      {isYouTubeActive && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="youtube-volume" className="flex items-center gap-2 text-settings-crimson">
              <Volume2 className="h-4 w-4" />
              YouTube volume
            </Label>
            <span className="text-sm text-settings-crimson/70">{youtubeVolume ?? 50}%</span>
          </div>
          <div style={crimsonSliderStyle}>
            <Slider
              id="youtube-volume"
              min={0}
              max={100}
              step={1}
              value={[youtubeVolume ?? 50]}
              onValueChange={handleVolumeChange}
              className="w-full [&_[data-slot=slider-track]]:bg-settings-crimson/20 [&_[data-slot=slider-range]]:bg-settings-crimson [&_[data-slot=slider-thumb]]:bg-settings-crimson [&_[data-slot=slider-thumb]]:border-settings-crimson"
            />
          </div>
          <p className="text-xs text-settings-crimson/60">
            Adjust the volume of the YouTube background video
          </p>
        </div>
      )}

      {/* Timer overlay toggle — only shown for video/youtube backgrounds */}
      {isVideoBackground && (
        <div className="rounded-lg border border-settings-crimson/30 bg-settings-pink-active p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Layers className="h-4 w-4 text-settings-crimson/70 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="timer-overlay-toggle" className="text-sm font-medium cursor-pointer text-settings-crimson">
                  Show timer overlay in fullscreen
                </Label>
                <p className="text-xs text-settings-crimson/60">
                  Display your active timer on top of the video when playing
                </p>
              </div>
            </div>
            <Switch
              id="timer-overlay-toggle"
              checked={showTimerOverlay}
              onCheckedChange={toggleTimerOverlay}
            />
          </div>
        </div>
      )}

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="url">
            <LinkIcon className="mr-2 h-4 w-4" />
            URL
          </TabsTrigger>
          <TabsTrigger value="youtube">
            <SiYoutube className="mr-2 h-4 w-4" />
            YouTube
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload" className="text-settings-crimson">Choose Image or Video</Label>
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              onClick={handleFileInputClick}
              className="cursor-pointer border-settings-crimson/30 text-settings-crimson"
            />
            <p className="text-xs text-settings-crimson/60">
              Supports all browser-compatible image and video formats
            </p>
          </div>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url-input" className="text-settings-crimson">Media URL</Label>
            <div className="flex gap-2">
              <Input
                id="url-input"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isProbing && handleUrlSubmit()}
                disabled={isProbing}
                className="border-settings-crimson/30 text-settings-crimson placeholder:text-settings-crimson/40"
              />
              <Button
                onClick={handleUrlSubmit}
                disabled={isProbing}
                className="bg-settings-crimson text-white hover:bg-settings-crimson-hover border-0"
              >
                {isProbing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  'Set'
                )}
              </Button>
            </div>
            <p className="text-xs text-settings-crimson/60">
              Enter a direct link to an image or video file
            </p>
          </div>
        </TabsContent>

        <TabsContent value="youtube" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube-input" className="text-settings-crimson">YouTube URL</Label>
            <div className="flex gap-2">
              <Input
                id="youtube-input"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleYouTubeSubmit()}
                className="border-settings-crimson/30 text-settings-crimson placeholder:text-settings-crimson/40"
              />
              <Button
                onClick={handleYouTubeSubmit}
                className="bg-settings-crimson text-white hover:bg-settings-crimson-hover border-0"
              >
                Set
              </Button>
            </div>
            <p className="text-xs text-settings-crimson/60">
              Paste any YouTube video URL (watch, youtu.be, or embed link)
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
