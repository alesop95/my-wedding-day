import { useMemo } from "react";
import { isDev } from "../utils/env";

/**
 * Layer 2 — Testing Mode: override di visibilità per sezioni condizionali.
 *
 * Attivabile via:
 *   - Query parameter: `?testing=true`
 *   - LocalStorage: `wedding-testing-mode=true`
 *   - Environment variable (solo dev): `REACT_APP_TESTING_MODE=true`
 *
 * In testing mode, TUTTI i flag `forceXVisible` sono `true`: questo mostra
 * tutte le sezioni condizionali indipendentemente dallo stato temporale
 * reale, senza alterare la business logic (che legge da `useWeddingTime`).
 *
 * I flag sono granulari per consentire, in futuro, override mirati
 * (es. testare solo una sezione via query param dedicato).
 */
export type TestingModeConfig = {
  isTestingMode: boolean;
  source: 'query' | 'localStorage' | 'env' | 'disabled';

  // Override di visibilità per sezioni condizionali in App.tsx
  forceAtHomeVisible: boolean;
  forceRSVPVisible: boolean;
  forceHotelVisible: boolean;
  forceGuestbookVisible: boolean;
  forcePhotoSharingVisible: boolean;
};

export const useTestingMode = (): TestingModeConfig => {
  return useMemo(() => {
    // Check query parameter (?testing=true)
    const urlParams = new URLSearchParams(window.location.search);
    const queryTesting = urlParams.get('testing') === 'true';

    // Check localStorage flag
    const localStorageTesting = localStorage.getItem('wedding-testing-mode') === 'true';

    // Check environment variable (only in dev)
    const envTesting = isDev && process.env.REACT_APP_TESTING_MODE === 'true';

    // Determine if testing mode is active and source
    let isTestingMode = false;
    let source: TestingModeConfig['source'] = 'disabled';

    if (queryTesting) {
      isTestingMode = true;
      source = 'query';
    } else if (localStorageTesting) {
      isTestingMode = true;
      source = 'localStorage';
    } else if (envTesting) {
      isTestingMode = true;
      source = 'env';
    }

    // Log testing mode status in development
    if (isDev && isTestingMode) {
      console.log(`🧪 Testing mode active (source: ${source})`);
    }

    return {
      isTestingMode,
      source,
      // Master switch: quando testing mode è attivo, tutti i flag sono true
      forceAtHomeVisible: isTestingMode,
      forceRSVPVisible: isTestingMode,
      forceHotelVisible: isTestingMode,
      forceGuestbookVisible: isTestingMode,
      forcePhotoSharingVisible: isTestingMode
    };
  }, []);
};

// Helper functions for manual testing control
export const enableTestingMode = () => {
  localStorage.setItem('wedding-testing-mode', 'true');
  window.location.reload();
};

export const disableTestingMode = () => {
  localStorage.removeItem('wedding-testing-mode');
  window.location.reload();
};

// Add to global window for console access
if (isDev) {
  (window as any).weddingTesting = {
    enable: enableTestingMode,
    disable: disableTestingMode,
    check: () => localStorage.getItem('wedding-testing-mode') === 'true'
  };
}
