import { useCallback, useEffect, useState } from "react";

export const useWedding = () => {
  const [isWeddingStarted, setIsWeddingStarted] = useState(false);
  const [isWeddingOver, setIsWeddingOver] = useState(false);
  const [isPartyStarted, setIsPartyStarted] = useState(false);

  const computeTime = useCallback(() => {
    const now = new Date();
    const weddingStart = new Date(2027, 6, 24);
    const tomorrow = new Date(2027, 6, 25);
    const partyStart = new Date(2027, 6, 24, 19, 30);
    setIsWeddingStarted(now > weddingStart);
    setIsPartyStarted(now > partyStart);
    setIsWeddingOver(now >= tomorrow);
  }, []);

  setInterval(computeTime, 1000 * 60 * 15);
  useEffect(() => {
    computeTime();
  }, [computeTime]);
  return { isWeddingStarted, isPartyStarted, isWeddingOver };
};
