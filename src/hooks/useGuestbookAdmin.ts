import { useCallback } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../App";
import { GuestbookEntry } from "../types/guestbook";
import { Either, left, right } from "fp-ts/Either";
import { TaskEither } from "fp-ts/TaskEither";
import { useGuestbook } from "./useGuestbook";

export const useGuestbookAdmin = () => {
  const { messages, loading, error } = useGuestbook();

  const deleteMessage = useCallback(
    (messageId: string): TaskEither<Error, void> => {
      return async (): Promise<Either<Error, void>> => {
        try {
          await deleteDoc(doc(db, "guestbook", messageId));
          return right(undefined);
        } catch (err) {
          console.error("Error deleting guestbook message:", err);
          return left(
            err instanceof Error ? err : new Error("Errore eliminazione messaggio")
          );
        }
      };
    },
    []
  );

  const getTotalMessages = useCallback(() => {
    return messages.length;
  }, [messages]);

  const getMessagesByFamily = useCallback(() => {
    const byFamily = new Map<string, number>();
    messages.forEach(msg => {
      const count = byFamily.get(msg.familyId) || 0;
      byFamily.set(msg.familyId, count + 1);
    });
    return byFamily;
  }, [messages]);

  return {
    messages,
    loading,
    error,
    deleteMessage,
    getTotalMessages,
    getMessagesByFamily,
  };
};