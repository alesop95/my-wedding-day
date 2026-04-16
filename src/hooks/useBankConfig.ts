import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../App";

type BankConfig = {
  iban: string;
  owner: string;
  bicSwift: string;
};

type UseBankConfigResult = {
  bankConfig: BankConfig | null;
  loading: boolean;
  error: Error | null;
};

export const useBankConfig = (): UseBankConfigResult => {
  const [bankConfig, setBankConfig] = useState<BankConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBankConfig = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "config", "bank");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as BankConfig;
          setBankConfig(data);
        } else {
          // Fallback to constants if Firestore config doesn't exist
          const { bank } = await import("../utils/constants");
          setBankConfig({
            iban: bank.iban,
            owner: bank.owner,
            bicSwift: bank.bicSwift
          });
        }
      } catch (err) {
        console.error("Error fetching bank config:", err);
        setError(err as Error);

        // Fallback to constants on error
        try {
          const { bank } = await import("../utils/constants");
          setBankConfig({
            iban: bank.iban,
            owner: bank.owner,
            bicSwift: bank.bicSwift
          });
        } catch (fallbackErr) {
          console.error("Error loading fallback bank config:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBankConfig();
  }, []);

  return { bankConfig, loading, error };
};