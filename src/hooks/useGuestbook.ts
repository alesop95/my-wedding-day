import { useEffect, useState, useCallback } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "../App";
import { GuestbookEntry } from "../types/guestbook";
import { Either, left, right } from "fp-ts/Either";
import { TaskEither } from "fp-ts/TaskEither";
import { useFamilyData } from "./useFamilyData";

export const useGuestbook = () => {
  const [messages, setMessages] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const familyResult = useFamilyData();
  const familyId = familyResult?.kind === "success" ? familyResult.data.id : null;

  useEffect(() => {
    const q = query(
      collection(db, "guestbook"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const guestbookEntries: GuestbookEntry[] = [];
          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const entry: GuestbookEntry = {
              id: doc.id,
              familyId: data.familyId,
              authorName: data.authorName,
              message: data.message,
              createdAt: (data.createdAt as Timestamp).toDate(),
            };
            guestbookEntries.push(entry);
          });
          setMessages(guestbookEntries);
          setError(null);
        } catch (err) {
          console.error("Error processing guestbook data:", err);
          setError(err instanceof Error ? err : new Error("Errore caricamento messaggi"));
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error listening to guestbook:", err);
        setError(err instanceof Error ? err : new Error("Errore connessione real-time"));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const sendMessage = useCallback(
    (authorName: string, message: string): TaskEither<Error, void> => {
      return async (): Promise<Either<Error, void>> => {
        try {
          if (!familyId) {
            return left(new Error("Famiglia non trovata"));
          }

          if (!authorName.trim()) {
            return left(new Error("Il nome è obbligatorio"));
          }

          if (!message.trim()) {
            return left(new Error("Il messaggio non può essere vuoto"));
          }

          if (message.length > 500) {
            return left(new Error("Il messaggio non può superare i 500 caratteri"));
          }

          await addDoc(collection(db, "guestbook"), {
            familyId,
            authorName: authorName.trim(),
            message: message.trim(),
            createdAt: serverTimestamp(),
          });

          return right(undefined);
        } catch (err) {
          console.error("Error sending guestbook message:", err);
          return left(
            err instanceof Error ? err : new Error("Errore invio messaggio")
          );
        }
      };
    },
    [familyId]
  );

  return {
    messages,
    loading,
    error,
    sendMessage,
    canSendMessage: !!familyId,
  };
};