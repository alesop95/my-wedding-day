import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../App";
import { BankConfig, BankState } from "../types/bank";

export const useBankConfig = (): BankState => {
  const [state, setState] = useState<BankState>({
    config: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchBankConfig = async () => {
      try {
        const docRef = doc(db, "config", "bank");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as BankConfig;
          setState({
            config: data,
            loading: false,
            error: null
          });
        } else {
          setState({
            config: null,
            loading: false,
            error: "Bank configuration not found"
          });
        }
      } catch (error) {
        setState({
          config: null,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    };

    fetchBankConfig();
  }, []);

  return state;
};