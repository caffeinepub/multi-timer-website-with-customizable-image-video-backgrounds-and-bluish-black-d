import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Share2, Copy, ExternalLink, Check, Info } from 'lucide-react';
import { useIsEmbeddedPreview } from './useIsEmbeddedPreview';

export function PublishShareSheet() {
  const [copied, setCopied] = useState(false);
  const isEmbedded = useIsEmbeddedPreview();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(currentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm">
          <Share2 className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Publish & Share</SheetTitle>
          <SheetDescription>
            Share your timer app with others
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Current URL Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium">App URL</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm break-all">
                {currentUrl}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleCopyLink}
              className="w-full"
              variant="default"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>

            <Button
              onClick={handleOpenInNewTab}
              className="w-full"
              variant="outline"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in New Tab
            </Button>
          </div>

          {/* Publishing Instructions */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium">How to publish your timer app:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Look at the <strong>top right</strong> of the Caffeine interface</li>
                  <li>Click the <strong>Live</strong> tab</li>
                  <li>Click the <strong>Go live</strong> button</li>
                  <li>Wait a few seconds for deployment</li>
                  <li>Your public URL will appear at the top of the Live panel</li>
                </ol>
              </div>
            </div>

            {/* Extra hint for embedded preview */}
            {isEmbedded && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> You're currently viewing the editor preview. 
                  The URL shown above is for this preview context. After publishing via 
                  the <strong>Go live</strong> button, your public URL will be displayed 
                  in the Live tab.
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
