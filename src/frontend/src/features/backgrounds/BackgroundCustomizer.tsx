import { useState } from 'react';
import { useBackground } from './useBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { SiYoutube } from 'react-icons/si';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { inferMediaType } from './mediaSupport';

export function BackgroundCustomizer() {
  const { backgroundUrl, youtubeVideoId, setBackgroundFromFile, setBackgroundFromUrl, setBackgroundFromYouTubeUrl, clearBackground, error } = useBackground();
  const [urlInput, setUrlInput] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError(null);
    const mediaType = inferMediaType(file.type);
    
    if (!mediaType) {
      setLocalError('Unsupported file type. Please select an image or video file.');
      return;
    }

    setBackgroundFromFile(file);
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setLocalError('Please enter a valid URL');
      return;
    }

    setLocalError(null);
    setBackgroundFromUrl(urlInput.trim());
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

  return (
    <div className="space-y-4">
      {(error || localError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || localError}</AlertDescription>
        </Alert>
      )}

      {(backgroundUrl || youtubeVideoId) && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Background active</p>
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
              id="file-upload"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
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
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              />
              <Button onClick={handleUrlSubmit}>Set</Button>
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
