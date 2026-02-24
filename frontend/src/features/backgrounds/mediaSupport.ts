export function inferMediaType(mimeType: string): 'image' | 'video' | null {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType.startsWith('video/')) {
    return 'video';
  }
  return null;
}

export function getMediaErrorMessage(error: Event | string): string {
  if (typeof error === 'string') {
    return error;
  }
  return 'Media failed to load. This format may not be supported by your current browser.';
}

/**
 * Extract file extension from URL, ignoring query strings and fragments
 */
export function extractExtensionFromUrl(urlString: string): string | null {
  try {
    const url = new URL(urlString);
    const pathname = url.pathname;
    const lastDot = pathname.lastIndexOf('.');
    const lastSlash = pathname.lastIndexOf('/');
    
    if (lastDot > lastSlash && lastDot !== -1) {
      return pathname.substring(lastDot + 1).toLowerCase();
    }
    return null;
  } catch {
    // If URL parsing fails, try simple extraction as fallback
    const match = urlString.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
    return match ? match[1].toLowerCase() : null;
  }
}

/**
 * Infer media type from URL extension
 */
export function inferMediaTypeFromUrl(urlString: string): 'image' | 'video' | null {
  const extension = extractExtensionFromUrl(urlString);
  if (!extension) return null;

  const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'm4v'];
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif', 'ico'];

  if (videoExts.includes(extension)) {
    return 'video';
  }
  if (imageExts.includes(extension)) {
    return 'image';
  }
  return null;
}

/**
 * Validate URL string format
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Probe if URL loads as an image
 */
export function probeImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout after 10 seconds
    setTimeout(() => resolve(false), 10000);
  });
}

/**
 * Probe if URL loads as a video
 */
export function probeVideo(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => resolve(true);
    video.onerror = () => resolve(false);
    video.src = url;
    video.load();
    
    // Timeout after 10 seconds
    setTimeout(() => resolve(false), 10000);
  });
}

/**
 * Generate user-friendly error messages
 */
export function getUrlErrorMessage(type: 'invalid' | 'load-failed' | 'unsupported'): string {
  switch (type) {
    case 'invalid':
      return 'Invalid URL format. Please enter a valid http:// or https:// URL.';
    case 'load-failed':
      return 'Media failed to load. The URL may be unreachable, blocked by CORS, or the format may not be supported by your browser.';
    case 'unsupported':
      return 'Unable to determine media type. Please use a direct link to an image or video file.';
    default:
      return 'An error occurred while loading the media.';
  }
}
