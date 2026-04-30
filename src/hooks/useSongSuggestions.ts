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
import { getAuth, signInAnonymously } from "firebase/auth";
import { db, firebaseApp } from "../App";
import { SongSuggestion } from "../types/songSuggestion";
import { Either, left, right } from "fp-ts/Either";
import { TaskEither } from "fp-ts/TaskEither";
import { useFamilyData } from "./useFamilyData";

const MAX_TITLE_LENGTH = 100;
const MAX_ARTIST_LENGTH = 100;
const MAX_AUTHOR_LENGTH = 50;
const MAX_NOTE_LENGTH = 300;

export type NewSuggestionInput = {
  authorName: string;
  songTitle: string;
  artist: string;
  note?: string;
};

export const useSongSuggestions = () => {
  const [suggestions, setSuggestions] = useState<SongSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const familyResult = useFamilyData();
  const familyId = familyResult?.kind === "success" ? familyResult.data.id : null;

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    signInAnonymously(getAuth(firebaseApp))
      .then(() => {
        const q = query(
          collection(db, "songSuggestions"),
          orderBy("createdAt", "desc")
        );

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            try {
              const entries: SongSuggestion[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                  id: doc.id,
                  familyId: data.familyId,
                  authorName: data.authorName,
                  songTitle: data.songTitle,
                  artist: data.artist,
                  note: data.note || undefined,
                  createdAt: data.createdAt
                    ? (data.createdAt as Timestamp).toDate()
                    : new Date()
                };
              });
              setSuggestions(entries);
              setError(null);
            } catch (err) {
              console.error("Error processing song suggestions:", err);
              setError(
                err instanceof Error ? err : new Error("Errore caricamento suggerimenti")
              );
            } finally {
              setLoading(false);
            }
          },
          (err) => {
            console.error("Error listening to song suggestions:", err);
            setError(
              err instanceof Error ? err : new Error("Errore connessione real-time")
            );
            setLoading(false);
          }
        );
      })
      .catch((err) => {
        console.error("Error signing in anonymously:", err);
        setError(err instanceof Error ? err : new Error("Errore autenticazione"));
        setLoading(false);
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const addSuggestion = useCallback(
    (input: NewSuggestionInput): TaskEither<Error, void> => {
      return async (): Promise<Either<Error, void>> => {
        try {
          if (!familyId) {
            return left(new Error("Famiglia non trovata"));
          }

          const { authorName, songTitle, artist, note } = input;

          if (!authorName.trim()) {
            return left(new Error("Il nome è obbligatorio"));
          }
          if (authorName.length > MAX_AUTHOR_LENGTH) {
            return left(new Error(`Il nome non può superare i ${MAX_AUTHOR_LENGTH} caratteri`));
          }
          if (!songTitle.trim()) {
            return left(new Error("Il titolo del brano è obbligatorio"));
          }
          if (songTitle.length > MAX_TITLE_LENGTH) {
            return left(new Error(`Il titolo non può superare i ${MAX_TITLE_LENGTH} caratteri`));
          }
          if (!artist.trim()) {
            return left(new Error("L'artista è obbligatorio"));
          }
          if (artist.length > MAX_ARTIST_LENGTH) {
            return left(new Error(`L'artista non può superare i ${MAX_ARTIST_LENGTH} caratteri`));
          }
          if (note && note.length > MAX_NOTE_LENGTH) {
            return left(new Error(`La nota non può superare i ${MAX_NOTE_LENGTH} caratteri`));
          }

          await signInAnonymously(getAuth(firebaseApp));

          const payload: Record<string, unknown> = {
            familyId,
            authorName: authorName.trim(),
            songTitle: songTitle.trim(),
            artist: artist.trim(),
            createdAt: serverTimestamp()
          };
          if (note && note.trim()) {
            payload.note = note.trim();
          }

          await addDoc(collection(db, "songSuggestions"), payload);

          return right(undefined);
        } catch (err) {
          console.error("Error sending song suggestion:", err);
          return left(
            err instanceof Error ? err : new Error("Errore invio suggerimento")
          );
        }
      };
    },
    [familyId]
  );

  return {
    suggestions,
    loading,
    error,
    addSuggestion,
    canSendSuggestion: !!familyId
  };
};

export const SONG_SUGGESTION_LIMITS = {
  title: MAX_TITLE_LENGTH,
  artist: MAX_ARTIST_LENGTH,
  author: MAX_AUTHOR_LENGTH,
  note: MAX_NOTE_LENGTH
};
