import { useState, useEffect } from 'react';

/**
 * Detects whether the app is running inside an iframe (e.g., Caffeine editor preview).
 * Returns true if embedded, false otherwise.
 */
export function useIsEmbeddedPreview(): boolean {
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    try {
      // If window.self !== window.top, we're in an iframe
      setIsEmbedded(window.self !== window.top);
    } catch (e) {
      // Cross-origin restrictions may throw; assume embedded if we can't check
      setIsEmbedded(true);
    }
  }, []);

  return isEmbedded;
}
