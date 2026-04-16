import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../App";

type ContactConfig = {
  name: string;
  number: string;
  message: string;
  image: string;
};

type UseContactsConfigResult = {
  contacts: ContactConfig[];
  loading: boolean;
  error: Error | null;
};

export const useContactsConfig = (): UseContactsConfigResult => {
  const [contacts, setContacts] = useState<ContactConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContactsConfig = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "config", "contacts");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setContacts(data.whatsAppContacts || []);
        } else {
          // Fallback to hardcoded contacts if Firestore config doesn't exist
          setContacts([
            {
              name: "Beatrice",
              number: "+393331983242",
              message: "",
              image: "./header/giulia.svg"
            },
            {
              name: "Alessio",
              number: "+393201950043",
              message: "",
              image: "./header/mario.svg"
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching contacts config:", err);
        setError(err as Error);

        // Fallback to hardcoded contacts on error
        setContacts([
          {
            name: "Beatrice",
            number: "+393331983242",
            message: "",
            image: "./header/giulia.svg"
          },
          {
            name: "Alessio",
            number: "+393201950043",
            message: "",
            image: "./header/mario.svg"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchContactsConfig();
  }, []);

  return { contacts, loading, error };
};