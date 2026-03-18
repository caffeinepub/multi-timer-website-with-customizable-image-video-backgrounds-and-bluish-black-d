import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Info,
  Share2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useIsEmbeddedPreview } from "./useIsEmbeddedPreview";

export function PublishShareSheet() {
  const [copied, setCopied] = useState(false);
  const isEmbedded = useIsEmbeddedPreview();
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for embedded/restricted contexts
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Fallback copy failed:", err);
          toast.error("Failed to copy link. Please copy manually.");
        } finally {
          textArea.remove();
        }
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link. Please copy manually.");
    }
  };

  const handleOpenInNewTab = () => {
    try {
      window.open(currentUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Failed to open in new tab:", err);
      toast.error("Failed to open link. Please try manually.");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-2 border-settings-crimson text-settings-crimson bg-settings-pink hover:bg-settings-crimson hover:text-white"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-settings-pink border-settings-crimson/40">
        <SheetHeader>
          <SheetTitle className="text-settings-crimson">
            Publish &amp; Share
          </SheetTitle>
          <SheetDescription className="text-settings-crimson/60">
            Share your timer app with others
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Embedded Preview Warning - Prominent */}
          {isEmbedded && (
            <Alert
              variant="default"
              className="border-settings-crimson/50 bg-settings-pink-active"
            >
              <AlertCircle className="h-4 w-4 text-settings-crimson" />
              <AlertDescription className="text-sm text-settings-crimson">
                <strong>Preview Mode:</strong> You&apos;re viewing the editor
                preview. The URL below is temporary. To get a public URL, use
                the <strong>Live</strong> tab and click <strong>Go live</strong>
                .
              </AlertDescription>
            </Alert>
          )}

          {/* Current URL Display */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-settings-crimson">
              {isEmbedded ? "Preview URL (This Session)" : "Current URL"}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-md border border-settings-crimson/40 bg-settings-pink-active px-3 py-2 text-sm break-all text-settings-crimson">
                {currentUrl}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleCopyLink}
              className="w-full bg-settings-crimson text-white hover:bg-settings-crimson-hover border-2 border-settings-crimson"
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
              className="w-full border-2 border-settings-crimson text-settings-crimson bg-transparent hover:bg-settings-crimson hover:text-white"
              variant="outline"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in New Tab
            </Button>
          </div>

          {/* Public URL Section */}
          <div className="rounded-lg border border-settings-crimson/30 bg-settings-pink-active p-4 space-y-3">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-settings-crimson mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-settings-crimson">
                  Get Your Public URL
                </p>
                <p className="text-settings-crimson/70">
                  To publish your app and get a permanent public URL:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-settings-crimson/70 ml-1">
                  <li>
                    Click the <strong>Live</strong> tab (top right of Caffeine)
                  </li>
                  <li>
                    Click the <strong>Go live</strong> button
                  </li>
                  <li>Wait a few seconds for deployment</li>
                  <li>Your public URL will appear at the top</li>
                </ol>
                <p className="text-xs text-settings-crimson/60 pt-2">
                  The public URL will remain accessible even after you close the
                  editor.
                </p>
              </div>
            </div>
          </div>

          {/* Publish to App Market Section */}
          <div className="rounded-lg border border-settings-crimson/30 bg-settings-pink-active p-4 space-y-3">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-settings-crimson mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-settings-crimson">
                  Publish to the App Market
                </p>
                <p className="text-settings-crimson/70">
                  Once your app is live, you can submit it to the Caffeine App
                  Market:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-settings-crimson/70 ml-1">
                  <li>
                    Ensure your app is <strong>live</strong> with a public URL
                    (see above)
                  </li>
                  <li>
                    In Caffeine, navigate to the <strong>App Market</strong>{" "}
                    section in the left sidebar
                  </li>
                  <li>
                    Click <strong>&quot;Submit Your App&quot;</strong> or{" "}
                    <strong>&quot;Publish to Market&quot;</strong>
                  </li>
                  <li>
                    Fill in your app details: name, description, category, and
                    screenshots
                  </li>
                  <li>Provide your live app URL</li>
                  <li>
                    Submit for review — the Caffeine team will review and
                    approve your submission
                  </li>
                </ol>
                <Alert
                  variant="default"
                  className="mt-3 border-settings-crimson/30 bg-settings-pink"
                >
                  <Info className="h-4 w-4 text-settings-crimson" />
                  <AlertDescription className="text-xs text-settings-crimson">
                    <strong>Note:</strong> This publishing flow is for apps
                    built and deployed via Caffeine. It does not apply to Wix
                    sites or integrate with the Wix App Market.
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
