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
      .catch(() => {
        setAdmin(false);
      });
  }, []);

  return admin;
};

export const useAdminData = () => {
  const [data, setData] = useState<FamilyData[]>();
  const loadData = useCallback(() => {
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
      .catch(() => {});
  }, []);
  useEffect(() => {
    loadData();
  }, [loadData]);
  return [data, loadData] as const;
};
