// Alert sound options and safe playback utilities
import { playYouTubeSound, isYouTubeUrl } from '../sounds/youtubeSoundPlayer';

export type AlertSoundOption = 'off' | 'beep' | 'chime' | 'bell' | string; // string for custom sound IDs

export interface AlertSound {
  id: AlertSoundOption;
  label: string;
  description: string;
}

export const ALERT_SOUNDS: AlertSound[] = [
  { id: 'off', label: 'Off', description: 'No sound' },
  { id: 'beep', label: 'Beep', description: 'Simple beep tone' },
  { id: 'chime', label: 'Chime', description: 'Pleasant chime' },
  { id: 'bell', label: 'Bell', description: 'Bell ring' },
];

/**
 * Safely play the selected alert sound.
 * Returns true if playback succeeded, false otherwise.
 * Never throws errors.
 */
export async function playAlertSound(soundId: AlertSoundOption, customSoundUrl?: string): Promise<boolean> {
  if (soundId === 'off') {
    return true; // "Success" - user chose silence
  }

  // If it's a custom sound ID and we have a URL, play the custom sound
  if (soundId.startsWith('custom-') && customSoundUrl) {
    return await playCustomSound(customSoundUrl);
  }

  // Otherwise play built-in sound
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    switch (soundId) {
      case 'beep':
        await playBeep(audioContext);
        break;
      case 'chime':
        await playChime(audioContext);
        break;
      case 'bell':
        await playBell(audioContext);
        break;
      default:
        return false;
    }
    
    return true;
  } catch (error) {
    console.warn('Could not play alert sound:', error);
    return false;
  }
}

async function playCustomSound(url: string): Promise<boolean> {
  try {
    // Check if it's a YouTube URL
    if (isYouTubeUrl(url)) {
      // Play YouTube sound with full duration (no auto-stop for completion alerts)
      return await playYouTubeSound(url, 50, 5000);
    }

    // Otherwise play as direct audio
    const audio = new Audio(url);
    audio.volume = 0.5;
    await audio.play();
    return true;
  } catch (error) {
    console.warn('Could not play custom sound:', error);
    return false;
  }
}

async function playBeep(audioContext: AudioContext): Promise<void> {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
  
  // Wait for sound to finish
  await new Promise(resolve => setTimeout(resolve, 500));
}

async function playChime(audioContext: AudioContext): Promise<void> {
  // Play a pleasant two-tone chime
  const frequencies = [523.25, 659.25]; // C5 and E5
  const duration = 0.4;
  
  for (let i = 0; i < frequencies.length; i++) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequencies[i];
    oscillator.type = 'sine';
    
    const startTime = audioContext.currentTime + (i * 0.15);
    gainNode.gain.setValueAtTime(0.25, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }
  
  // Wait for sound to finish
  await new Promise(resolve => setTimeout(resolve, 700));
}

async function playBell(audioContext: AudioContext): Promise<void> {
  // Play a bell-like sound with harmonics
  const fundamental = 440; // A4
  const harmonics = [1, 2, 3, 4.2, 5.4];
  const duration = 1.2;
  
  harmonics.forEach((harmonic, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = fundamental * harmonic;
    oscillator.type = 'sine';
    
    const amplitude = 0.15 / (index + 1); // Decreasing amplitude for higher harmonics
    gainNode.gain.setValueAtTime(amplitude, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  });
  
  // Wait for sound to finish
  await new Promise(resolve => setTimeout(resolve, 1200));
}
