/**
 * Extracts a YouTube video ID from common URL formats.
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID (mobile)
 * 
 * Returns the video ID or an error message.
 */
export function parseYouTubeUrl(url: string): { videoId: string } | { error: string } {
  try {
    const urlObj = new URL(url);
    
    // Handle youtube.com/watch?v=VIDEO_ID (including www, m, and bare youtube.com)
    if (
      urlObj.hostname === 'www.youtube.com' || 
      urlObj.hostname === 'youtube.com' ||
      urlObj.hostname === 'm.youtube.com'
    ) {
      if (urlObj.pathname === '/watch') {
        const videoId = urlObj.searchParams.get('v');
        if (videoId && videoId.length === 11) {
          return { videoId };
        }
        return { error: 'Invalid YouTube URL: missing or invalid video ID in watch URL.' };
      }
      
      // Handle youtube.com/embed/VIDEO_ID
      if (urlObj.pathname.startsWith('/embed/')) {
        const videoId = urlObj.pathname.split('/embed/')[1]?.split('?')[0]?.split('/')[0];
        if (videoId && videoId.length === 11) {
          return { videoId };
        }
        return { error: 'Invalid YouTube URL: missing or invalid video ID in embed URL.' };
      }
      
      // Handle youtube.com/v/VIDEO_ID (older format)
      if (urlObj.pathname.startsWith('/v/')) {
        const videoId = urlObj.pathname.split('/v/')[1]?.split('?')[0]?.split('/')[0];
        if (videoId && videoId.length === 11) {
          return { videoId };
        }
        return { error: 'Invalid YouTube URL: missing or invalid video ID.' };
      }
      
      return { error: 'Unsupported YouTube URL format. Please use a watch, embed, or youtu.be link.' };
    }
    
    // Handle youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1).split('?')[0].split('/')[0];
      if (videoId && videoId.length === 11) {
        return { videoId };
      }
      return { error: 'Invalid YouTube URL: missing or invalid video ID in short URL.' };
    }
    
    return { error: 'Not a recognized YouTube URL. Please use a youtube.com or youtu.be link.' };
  } catch {
    return { error: 'Invalid URL format. Please enter a valid YouTube link.' };
  }
}

/**
 * Builds a YouTube embed URL with parameters optimized for background playback.
 */
export function buildYouTubeEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: videoId, // Required for loop to work
    controls: '0',
    showinfo: '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1',
  });
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
