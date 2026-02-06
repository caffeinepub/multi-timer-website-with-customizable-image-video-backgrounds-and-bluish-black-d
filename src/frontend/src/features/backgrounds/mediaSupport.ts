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
