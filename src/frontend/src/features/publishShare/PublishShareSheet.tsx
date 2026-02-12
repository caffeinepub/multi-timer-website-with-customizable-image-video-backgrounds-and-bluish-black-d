import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Share2, Copy, ExternalLink, Check, Info, AlertCircle, Sparkles } from 'lucide-react';
import { useIsEmbeddedPreview } from './useIsEmbeddedPreview';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Publish & Share</SheetTitle>
          <SheetDescription>
            Share your timer app with others
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Embedded Preview Warning - Prominent */}
          {isEmbedded && (
            <Alert variant="default" className="border-primary/50 bg-primary/5">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <strong>Preview Mode:</strong> You're viewing the editor preview. 
                The URL below is temporary. To get a public URL, use the <strong>Live</strong> tab 
                and click <strong>Go live</strong>.
              </AlertDescription>
            </Alert>
          )}

          {/* Current URL Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {isEmbedded ? 'Preview URL (This Session)' : 'Current URL'}
            </label>
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

          {/* Public URL Section */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium">Get Your Public URL</p>
                <p className="text-muted-foreground">
                  To publish your app and get a permanent public URL:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground ml-1">
                  <li>Click the <strong>Live</strong> tab (top right of Caffeine)</li>
                  <li>Click the <strong>Go live</strong> button</li>
                  <li>Wait a few seconds for deployment</li>
                  <li>Your public URL will appear at the top</li>
                </ol>
                <p className="text-xs text-muted-foreground pt-2">
                  The public URL will remain accessible even after you close the editor.
                </p>
              </div>
            </div>
          </div>

          {/* Publish to App Market Section */}
          <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-4 space-y-3">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium">Publish to the App Market</p>
                <p className="text-muted-foreground">
                  Once your app is live, you can submit it to the Caffeine App Market:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground ml-1">
                  <li>Ensure your app is <strong>live</strong> with a public URL (see above)</li>
                  <li>In Caffeine, navigate to the <strong>App Market</strong> section in the left sidebar</li>
                  <li>Click <strong>"Submit Your App"</strong> or <strong>"Publish to Market"</strong></li>
                  <li>Fill in your app details: name, description, category, and screenshots</li>
                  <li>Provide your live app URL</li>
                  <li>Submit for review — the Caffeine team will review and approve your submission</li>
                </ol>
                <Alert variant="default" className="mt-3 border-muted bg-background/50">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Note:</strong> This publishing flow is for apps built and deployed via Caffeine. 
                    It does not apply to Wix sites or integrate with the Wix App Market.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
