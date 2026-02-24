// Music URL parsing and classification utilities

export type MusicSourceType = 'spotify' | 'apple' | 'direct-audio' | 'unknown';

interface SpotifyResult {
  type: 'spotify';
  embedUrl: string;
}

interface AppleMusicResult {
  type: 'apple';
  embedUrl: string;
}

interface DirectAudioResult {
  type: 'direct-audio';
  url: string;
}

interface UnknownResult {
  type: 'unknown';
  error: string;
}

export type MusicUrlResult = SpotifyResult | AppleMusicResult | DirectAudioResult | UnknownResult;

const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm'];

function extractExtension(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const ext = AUDIO_EXTENSIONS.find(e => pathname.endsWith(e));
    return ext || null;
  } catch {
    return null;
  }
}

function isDirectAudioUrl(url: string): boolean {
  return extractExtension(url) !== null;
}

function parseSpotifyUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Handle open.spotify.com URLs
    if (urlObj.hostname === 'open.spotify.com') {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      // Expected format: /track/ID or /playlist/ID or /album/ID
      if (pathParts.length >= 2) {
        const type = pathParts[0]; // track, playlist, album
        const id = pathParts[1];
        
        if (type && id) {
          return `https://open.spotify.com/embed/${type}/${id}`;
        }
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

function parseAppleMusicUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Handle music.apple.com URLs
    if (urlObj.hostname === 'music.apple.com') {
      // Apple Music embed format: https://embed.music.apple.com/[country]/[type]/[name]/[id]
      // Input format: https://music.apple.com/[country]/[type]/[name]/[id]
      
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      if (pathParts.length >= 3) {
        const country = pathParts[0];
        const type = pathParts[1]; // album, playlist, song
        const rest = pathParts.slice(2).join('/');
        
        return `https://embed.music.apple.com/${country}/${type}/${rest}`;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

export function parseMusicUrl(url: string): MusicUrlResult {
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return {
      type: 'unknown',
      error: 'Please enter a valid URL.',
    };
  }
  
  // Check if it's a direct audio URL
  if (isDirectAudioUrl(trimmedUrl)) {
    return {
      type: 'direct-audio',
      url: trimmedUrl,
    };
  }
  
  // Try Spotify
  const spotifyEmbed = parseSpotifyUrl(trimmedUrl);
  if (spotifyEmbed) {
    return {
      type: 'spotify',
      embedUrl: spotifyEmbed,
    };
  }
  
  // Try Apple Music
  const appleEmbed = parseAppleMusicUrl(trimmedUrl);
  if (appleEmbed) {
    return {
      type: 'apple',
      embedUrl: appleEmbed,
    };
  }
  
  // Unknown/unsupported
  return {
    type: 'unknown',
    error: 'This link cannot be played. Please use a Spotify or Apple Music share link, or a direct audio file URL (.mp3, .wav, .ogg, .m4a).',
  };
}

export function getMusicErrorMessage(type: 'load-failed' | 'invalid'): string {
  if (type === 'invalid') {
    return 'Invalid URL format. Please check the link and try again.';
  }
  return 'Failed to load audio. Please verify the link is accessible and try again.';
}
