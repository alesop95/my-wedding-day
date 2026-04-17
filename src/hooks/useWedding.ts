import { useCallback, useEffect, useState } from "react";

export const useWedding = () => {
  const [isWeddingStarted, setIsWeddingStarted] = useState(false);
  const [isWeddingOver, setIsWeddingOver] = useState(false);
  const [isPartyStarted, setIsPartyStarted] = useState(false);

  const computeTime = useCallback(() => {
    const now = new Date();
    const weddingStart = new Date(2027, 6, 24);
    const partyStart = new Date(2027, 6, 24, 19, 30);
    // Grace period: matrimonio considerato "finito" 30 minuti dopo mezzanotte
    // per evitare race condition e perdita stati non persistiti
    const weddingEndWithGracePeriod = new Date(2027, 6, 25, 0, 30);

    setIsWeddingStarted(now > weddingStart);
    setIsPartyStarted(now > partyStart);
    setIsWeddingOver(now >= weddingEndWithGracePeriod);
  }, []);

  useEffect(() => {
    computeTime();
    const interval = setInterval(computeTime, 1000 * 60 * 15);
    return () => {
      clearInterval(interval);
    };
  }, [computeTime]);
  return { isWeddingStarted, isPartyStarted, isWeddingOver };
};
