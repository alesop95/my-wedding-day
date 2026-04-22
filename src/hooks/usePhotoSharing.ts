import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../App";
import * as O from "fp-ts/Option";
import { useTestingMode } from "./useTestingMode";

export type PhotoSharingConfig = {
  driveUrl: string;
  enabled: boolean;
  visibleFrom?: string; // ISO timestamp quando la feature diventa visibile
};

export type PhotoSharingState = {
  config: O.Option<PhotoSharingConfig>;
  loading: boolean;
  error: O.Option<string>;
};

export const usePhotoSharing = () => {
  const { forcePhotoSharingVisible } = useTestingMode();
  const [state, setState] = useState<PhotoSharingState>({
    config: O.none,
    loading: true,
    error: O.none
  });

  useEffect(() => {
    const loadConfig = async () => {
      setState(prev => ({ ...prev, loading: true, error: O.none }));

      try {
        const configRef = doc(db, "config", "photoSharing");
        const configSnap = await getDoc(configRef);

        if (configSnap.exists()) {
          const data = configSnap.data();

          // Validate config data structure
          if (data && typeof data.driveUrl === "string" && typeof data.enabled === "boolean") {
            // Handle different visibleFrom formats
            let visibleFromValue: string | undefined = undefined;
            if (data.visibleFrom) {
              if (typeof data.visibleFrom === "string") {
                visibleFromValue = data.visibleFrom;
              } else if (data.visibleFrom && typeof data.visibleFrom.toDate === "function") {
                // Handle Firestore Timestamp
                visibleFromValue = data.visibleFrom.toDate().toISOString();
              } else if (data.visibleFrom instanceof Date) {
                visibleFromValue = data.visibleFrom.toISOString();
              }
            }

            const config: PhotoSharingConfig = {
              driveUrl: data.driveUrl,
              enabled: data.enabled,
              visibleFrom: visibleFromValue
            };

            console.log("📋 PhotoSharing config loaded:", config);
            setState({
              config: O.some(config),
              loading: false,
              error: O.none
            });
          } else {
            setState({
              config: O.none,
              loading: false,
              error: O.some("Invalid photo sharing configuration")
            });
          }
        } else {
          // Config document doesn't exist - feature disabled
          setState({
            config: O.none,
            loading: false,
            error: O.none
          });
        }
      } catch (err) {
        console.error("Error loading photo sharing config:", err);
        setState({
          config: O.none,
          loading: false,
          error: O.some("Failed to load photo sharing configuration")
        });
      }
    };

    loadConfig();
  }, []);

  // Helper functions to access state safely
  const getConfig = (): PhotoSharingConfig | null => {
    return O.isSome(state.config) ? state.config.value : null;
  };

  const getError = (): string | null => {
    return O.isSome(state.error) ? state.error.value : null;
  };

  const isEnabled = (): boolean => {
    const config = getConfig();
    return config ? config.enabled : false;
  };

  const getDriveUrl = (): string | null => {
    const config = getConfig();
    return config ? config.driveUrl : null;
  };

  const isVisible = (): boolean => {
    const config = getConfig();
    if (!config || !config.enabled) {
      console.log("🔍 PhotoSharing: Not visible - config disabled or missing");
      return false;
    }

    // Testing mode override - always visible
    if (forcePhotoSharingVisible) {
      console.log("🧪 PhotoSharing: Visible - Testing mode override");
      return true;
    }

    // Check if visibleFrom date is configured
    if (config.visibleFrom) {
      // Clean the date string - remove extra quotes if present
      const cleanDateString = config.visibleFrom.replace(/^["']|["']$/g, '');
      const visibleFromDate = new Date(cleanDateString);
      const now = new Date();

      // Check if the date is valid
      if (isNaN(visibleFromDate.getTime())) {
        console.error("❌ PhotoSharing: Invalid visibleFrom date format:", config.visibleFrom, "cleaned:", cleanDateString);
        // If date is invalid, fall back to backward compatibility (show if enabled)
        return true;
      }

      // Only log if date is valid
      const isVisible = now >= visibleFromDate;
      console.log("📅 PhotoSharing date check:", {
        visibleFrom: config.visibleFrom,
        visibleFromDate: visibleFromDate.toISOString(),
        now: now.toISOString(),
        isVisible
      });
      return isVisible;
    }

    // Default: visible if enabled (backward compatibility)
    console.log("🔍 PhotoSharing: Visible - No date restriction (backward compatibility)");
    return true;
  };

  return {
    // Raw state
    state,

    // Data accessors
    config: getConfig(),
    error: getError(),
    loading: state.loading,

    // Convenience accessors
    isEnabled: isEnabled(),
    driveUrl: getDriveUrl(),
    isVisible: isVisible(),

    // Status checks
    hasConfig: O.isSome(state.config),
    hasError: O.isSome(state.error)
  };
};