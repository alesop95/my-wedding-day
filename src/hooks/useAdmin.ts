import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../App";
import { useCallback, useEffect, useState } from "react";
import { FamilyData } from "../types/family";

export const useAdmin = (): boolean => {
  const [admin, setAdmin] = useState<boolean>(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url || url.pathname.replace("/", "") !== "admin") {
      setAdmin(false);
      return;
    }
    const password = url.searchParams.get("password");
    const q = query(collection(db, "admin"), where("password", "==", password));
    getDocs(q)
      .then(documentSnapshot => setAdmin(documentSnapshot.size > 0))
      .catch((err) => {
        console.error("Error checking admin authentication:", err);
        setAdmin(false);
      });
  }, []);

  return admin;
};

export const useAdminData = () => {
  const [data, setData] = useState<FamilyData[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);

    const q = query(collection(db, "wedding"));
    getDocs(q)
      .then(documentSnapshot => {
        const familyData: FamilyData[] = [];
        documentSnapshot.docs.forEach(doc => {
          const data = { id: doc.id, ...doc.data() } as FamilyData;
          familyData.push(data);
        });
        setData(familyData);
      })
      .catch((err) => {
        console.error("Error loading admin data:", err);
        setError(err instanceof Error ? err : new Error("Failed to load family data"));
        setData(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refetch: loadData } as const;
};
