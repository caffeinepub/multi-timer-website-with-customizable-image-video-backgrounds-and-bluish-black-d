import { useState, useRef } from 'react';
import { useBackgroundContext } from './BackgroundProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react';
import { SiYoutube } from 'react-icons/si';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { inferMediaType } from './mediaSupport';

export function BackgroundCustomizer() {
  const { backgroundUrl, youtubeVideoId, mediaType, setBackgroundFromFile, setBackgroundFromUrl, setBackgroundFromYouTubeUrl, clearBackground, error, isProbing } = useBackgroundContext();
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
    
    // Clear the input value so the same file can be selected again
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

  const isBackgroundActive = (backgroundUrl || youtubeVideoId) && !error;

  return (
    <div className="space-y-4">
      {(error || localError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || localError}</AlertDescription>
        </Alert>
      )}

      {isBackgroundActive && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">Background active</p>
              <p className="text-xs text-muted-foreground">
                {mediaType === 'youtube' ? 'YouTube video' : mediaType === 'video' ? 'Video' : 'Image'}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
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
            <Label htmlFor="file-upload">Choose Image or Video</Label>
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              onClick={handleFileInputClick}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Supports all browser-compatible image and video formats
            </p>
          </div>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url-input">Media URL</Label>
            <div className="flex gap-2">
              <Input
                id="url-input"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isProbing && handleUrlSubmit()}
                disabled={isProbing}
              />
              <Button onClick={handleUrlSubmit} disabled={isProbing}>
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
            <p className="text-xs text-muted-foreground">
              Enter a direct link to an image or video file
            </p>
          </div>
        </TabsContent>

        <TabsContent value="youtube" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube-input">YouTube URL</Label>
            <div className="flex gap-2">
              <Input
                id="youtube-input"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleYouTubeSubmit()}
              />
              <Button onClick={handleYouTubeSubmit}>Set</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Paste any YouTube video URL (watch, youtu.be, or embed link)
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
