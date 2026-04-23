import { weddingDate } from "./constants";

export const dayLeft = (): number => {
  const today = new Date();
  return Math.ceil(
    (weddingDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
  );
};
