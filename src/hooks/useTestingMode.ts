import { useMemo } from "react";
import { isDev } from "../utils/env";

export type TestingModeConfig = {
  isTestingMode: boolean;
  forcePartyStarted: boolean;
  forcePhotoSharingVisible: boolean;
  source: 'query' | 'localStorage' | 'env' | 'disabled';
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
      forcePartyStarted: isTestingMode, // In testing, force party started
      forcePhotoSharingVisible: isTestingMode, // In testing, force photo sharing visible
      source
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