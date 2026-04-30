import { useCallback } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../App";
import { Either, left, right } from "fp-ts/Either";
import { TaskEither } from "fp-ts/TaskEither";
import { useSongSuggestions } from "./useSongSuggestions";

export const useSongSuggestionsAdmin = () => {
  const { suggestions, loading, error } = useSongSuggestions();

  const deleteSuggestion = useCallback(
    (suggestionId: string): TaskEither<Error, void> => {
      return async (): Promise<Either<Error, void>> => {
        try {
          await deleteDoc(doc(db, "songSuggestions", suggestionId));
          return right(undefined);
        } catch (err) {
          console.error("Error deleting song suggestion:", err);
          return left(
            err instanceof Error ? err : new Error("Errore eliminazione suggerimento")
          );
        }
      };
    },
    []
  );

  const getTotalSuggestions = useCallback(() => {
    return suggestions.length;
  }, [suggestions]);

  return {
    suggestions,
    loading,
    error,
    deleteSuggestion,
    getTotalSuggestions
  };
};
