import { useWeddingTime } from "./useWeddingTime";
import { useTestingMode } from "./useTestingMode";

export type WeddingUIState = {
  // Stato temporale reale (pass-through da useWeddingTime)
  isWeddingStarted: boolean;
  isPartyStarted: boolean;
  isWeddingOver: boolean;

  // Flag di visibilità UI (combinano tempo reale + testing override)
  showAtHome: boolean;
  showRSVP: boolean;
  showHotel: boolean;
  showGuestbook: boolean;
  // Nota: GallerySection è sempre visibile in fondo (nessun gate).
  // Nota: PhotoSharingSection decide la sua visibilità internamente via
  // usePhotoSharing (logica `visibleFrom` + `forcePhotoSharingVisible`).
};

/**
 * Layer 3 — UI State per il rendering condizionale in App.tsx.
 *
 * Compone:
 *   - useWeddingTime (Layer 1) — stato temporale reale
 *   - useTestingMode (Layer 2) — override di visibilità
 *
 * Espone flag `show*` pronti da usare nel JSX. Ogni flag combina la
 * condizione temporale reale con l'override di testing corrispondente:
 *
 *   showX = forceXVisible || <condizione temporale reale per mostrare X>
 *
 * I flag `isWeddingStarted` / `isPartyStarted` / `isWeddingOver` esposti
 * qui sono quelli REALI (senza override), per consumer che vogliano
 * leggere solo lo stato temporale senza i flag di visibilità.
 */
export const useWedding = (): WeddingUIState => {
  const { isWeddingStarted, isPartyStarted, isWeddingOver } = useWeddingTime();
  const {
    forceAtHomeVisible,
    forceRSVPVisible,
    forceHotelVisible,
    forceGuestbookVisible
  } = useTestingMode();

  return {
    // Stato reale pass-through
    isWeddingStarted,
    isPartyStarted,
    isWeddingOver,

    // Regole di visibilità per App.tsx
    showAtHome: forceAtHomeVisible || !isPartyStarted,
    showRSVP: forceRSVPVisible || !isWeddingStarted,
    showHotel: forceHotelVisible || !isWeddingStarted,
    showGuestbook: forceGuestbookVisible || !isWeddingOver
  };
};
