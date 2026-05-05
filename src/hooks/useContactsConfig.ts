import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../App";
import { ContactsState } from "../types/contacts";

export const useContactsConfig = (): ContactsState => {
  const [state, setState] = useState<ContactsState>({
    contacts: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchContactsConfig = async () => {
      try {
        const docRef = doc(db, "config", "contacts");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setState({
            contacts: data.whatsAppContacts || [],
            loading: false,
            error: null
          });
        } else {
          setState({
            contacts: [],
            loading: false,
            error: "Contacts configuration not found"
          });
        }
      } catch (error) {
        setState({
          contacts: [],
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    };

    fetchContactsConfig();
  }, []);

  return state;
};