export const dayLeft = (): number => {
  const today = new Date();
  const weddingDate = new Date(2027, 6, 24); // 24 luglio 2027
  return Math.ceil(
    (weddingDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
  );
};
