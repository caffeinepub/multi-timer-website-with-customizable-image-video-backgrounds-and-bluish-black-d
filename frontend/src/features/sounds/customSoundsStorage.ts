import { safeGetItem, safeSetItem } from '@/lib/safeStorage';

const STORAGE_KEY = 'multitimer-custom-sounds';
const MAX_SOUNDS = 10;
const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB conservative limit for localStorage

export interface CustomSound {
  id: string;
  name: string;
  url: string;
}

export function getMaxCustomSounds(): number {
  return MAX_SOUNDS;
}

export function canAddMoreSounds(currentCount: number): boolean {
  return currentCount < MAX_SOUNDS;
}

export function generateSoundId(): string {
  return `sound-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function loadCustomSounds(): CustomSound[] {
  try {
    const stored = safeGetItem(STORAGE_KEY, 'local');
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    // Validate and normalize
    const valid = parsed
      .filter((item): item is CustomSound => 
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.url === 'string' &&
        item.id.trim() !== '' &&
        item.name.trim() !== '' &&
        item.url.trim() !== ''
      )
      .slice(0, MAX_SOUNDS);

    return valid;
  } catch (error) {
    console.error('Failed to load custom sounds:', error);
    return [];
  }
}

export function saveCustomSounds(sounds: CustomSound[]): { success: boolean; error?: string } {
  try {
    const toSave = sounds.slice(0, MAX_SOUNDS);
    const serialized = JSON.stringify(toSave);
    
    // Check size before saving
    const sizeInBytes = new Blob([serialized]).size;
    if (sizeInBytes > MAX_STORAGE_SIZE) {
      return {
        success: false,
        error: 'Storage limit exceeded. Try using shorter URLs or removing some sounds.',
      };
    }

    const success = safeSetItem(STORAGE_KEY, serialized, 'local');
    if (!success) {
      return {
        success: false,
        error: 'Storage quota exceeded. Try removing some sounds or using shorter URLs.',
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to save custom sounds:', error);
    
    // Check if it's a quota exceeded error
    if (error instanceof Error && (
      error.name === 'QuotaExceededError' ||
      error.message.includes('quota') ||
      error.message.includes('storage')
    )) {
      return {
        success: false,
        error: 'Storage quota exceeded. Try removing some sounds or using shorter URLs.',
      };
    }
    
    return {
      success: false,
      error: 'Failed to save sounds. Please try again.',
    };
  }
}

export function convertFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function isValidAudioFile(file: File): boolean {
  const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/aac', 'audio/m4a'];
  const validExtensions = ['.mp3', '.wav', '.ogg', '.webm', '.aac', '.m4a'];
  
  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  
  return hasValidType || hasValidExtension;
}
