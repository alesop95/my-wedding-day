import { useCallback, useEffect, useState } from "react";
import {
  partyStartDate,
  weddingDate,
  weddingEndDate
} from "../utils/constants";

export type WeddingTimeState = {
  isWeddingStarted: boolean;
  isPartyStarted: boolean;
  isWeddingOver: boolean;
};

/**
 * Layer 1 — Stato temporale REALE del matrimonio.
 *
 * Questo hook espone SOLO lo stato basato sulla data corrente del sistema.
 * NON applica override di testing mode.
 *
 * Usare per business logic (es. guardrail per bloccare operazioni dopo il
 * matrimonio), MAI per controllare la visibilità UI (che deve supportare
 * testing override - usare `useWedding` per quello).
 */
export const useWeddingTime = (): WeddingTimeState => {
  const [isWeddingStarted, setIsWeddingStarted] = useState(false);
  const [isWeddingOver, setIsWeddingOver] = useState(false);
  const [isPartyStarted, setIsPartyStarted] = useState(false);

  const computeTime = useCallback(() => {
    const now = new Date();
    setIsWeddingStarted(now > weddingDate);
    setIsPartyStarted(now > partyStartDate);
    setIsWeddingOver(now >= weddingEndDate);
  }, []);

  useEffect(() => {
    computeTime();
    const interval = setInterval(computeTime, 1000 * 60 * 15);
    return () => {
      clearInterval(interval);
    };
  }, [computeTime]);

  return {
    isWeddingStarted,
    isPartyStarted,
    isWeddingOver
  };
};
