import { function as F, array as A } from "fp-ts";
const allowedChars = "ABCDEFGHIJLMNOPQRSTUVXYZ0123456789";
// this function return an id for a new family generated starting from a list of allowed characters and length
export const generateId = (): string => {
  return F.pipe(
    Array(4).fill(0),
    A.map(() => allowedChars[Math.floor(Math.random() * allowedChars.length)]),
    A.reduce("", (acc, curr) => acc + curr)
  );
};
