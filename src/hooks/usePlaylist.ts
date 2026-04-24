import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../App";
import * as O from "fp-ts/Option";
import { PlaylistConfig, PlaylistState } from "../types/playlist";
import { useTestingMode } from "./useTestingMode";

export const usePlaylist = () => {
  const { forcePlaylistVisible } = useTestingMode();
  const [state, setState] = useState<PlaylistState>({
    config: O.none,
    loading: true,
    error: O.none
  });

  useEffect(() => {
    const loadConfig = async () => {
      setState(prev => ({ ...prev, loading: true, error: O.none }));

      try {
        const configRef = doc(db, "config", "playlist");
        const configSnap = await getDoc(configRef);

        if (configSnap.exists()) {
          const data = configSnap.data();

          if (data && typeof data.spotifyUrl === "string" && typeof data.enabled === "boolean") {
            const config: PlaylistConfig = {
              spotifyUrl: data.spotifyUrl,
              enabled: data.enabled
            };

            console.log("🎵 Playlist config loaded:", config);
            setState({
              config: O.some(config),
              loading: false,
              error: O.none
            });
          } else {
            setState({
              config: O.none,
              loading: false,
              error: O.some("Invalid playlist configuration")
            });
          }
        } else {
          setState({
            config: O.none,
            loading: false,
            error: O.none
          });
        }
      } catch (err) {
        console.error("Error loading playlist config:", err);
        setState({
          config: O.none,
          loading: false,
          error: O.some("Failed to load playlist configuration")
        });
      }
    };

    loadConfig();
  }, []);

  const getConfig = (): PlaylistConfig | null => {
    return O.isSome(state.config) ? state.config.value : null;
  };

  const getError = (): string | null => {
    return O.isSome(state.error) ? state.error.value : null;
  };

  const isEnabled = (): boolean => {
    const config = getConfig();
    return config ? config.enabled : false;
  };

  const getSpotifyUrl = (): string | null => {
    const config = getConfig();
    return config ? config.spotifyUrl : null;
  };

  const isVisible = (): boolean => {
    const config = getConfig();
    if (!config || !config.enabled) {
      console.log("🔍 Playlist: Not visible - config disabled or missing");
      return false;
    }

    // Testing mode override: placeholder per future estensioni temporali
    // (es. `visibleFrom`). Per ora, se config è enabled, è sempre visibile.
    if (forcePlaylistVisible) {
      console.log("🧪 Playlist: Visible - Testing mode override");
      return true;
    }

    return true;
  };

  return {
    state,
    config: getConfig(),
    error: getError(),
    loading: state.loading,
    isEnabled: isEnabled(),
    spotifyUrl: getSpotifyUrl(),
    isVisible: isVisible(),
    hasConfig: O.isSome(state.config),
    hasError: O.isSome(state.error)
  };
};
