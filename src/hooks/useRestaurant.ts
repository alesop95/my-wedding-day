import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from "firebase/firestore";
import { db, firebaseApp } from "../App";
import { FamilyData } from "../types/family";
import { RestaurantTable } from "../restaurant/type";
import { getAuth, signInAnonymously } from "firebase/auth";

export const usePrintMode = () => {
  const [isPrinting, setIsPrinting] = useState(() => {
    try {
      const stored = localStorage.getItem('restaurant-print-mode');
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  const togglePrintMode = useCallback(() => {
    setIsPrinting((prev: boolean) => {
      const newValue = !prev;
      try {
        localStorage.setItem('restaurant-print-mode', JSON.stringify(newValue));
      } catch (err) {
        console.warn('Impossibile salvare print mode in localStorage:', err);
      }
      return newValue;
    });
  }, []);

  const enablePrintMode = useCallback(() => {
    setIsPrinting(true);
    try {
      localStorage.setItem('restaurant-print-mode', JSON.stringify(true));
    } catch (err) {
      console.warn('Impossibile salvare print mode in localStorage:', err);
    }
  }, []);

  const disablePrintMode = useCallback(() => {
    setIsPrinting(false);
    try {
      localStorage.setItem('restaurant-print-mode', JSON.stringify(false));
    } catch (err) {
      console.warn('Impossibile salvare print mode in localStorage:', err);
    }
  }, []);

  return { isPrinting, togglePrintMode, enablePrintMode, disablePrintMode };
};
export const useRestaurant = (): boolean => {
  const [isRestaurant, setIsRestaurant] = useState<boolean>(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url || url.pathname.replace("/", "") !== "restaurant") {
      setIsRestaurant(false);
      return;
    }
    const password = url.searchParams.get("password");
    const q = query(collection(db, "admin"), where("password", "==", password));
    getDocs(q)
      .then(documentSnapshot => setIsRestaurant(documentSnapshot.size > 0))
      .catch(() => {
        setIsRestaurant(false);
      });
  }, []);

  return isRestaurant;
};

export const useLoadTables = () => {
  const [tables, setTables] = useState<RestaurantTable[]>();
  const [families, setFamilies] = useState<FamilyData[]>();
  const loadData = useCallback(() => {
    signInAnonymously(getAuth(firebaseApp)).then(() => {
      const docRef = doc(db, "tables", "tables");
      getDoc(docRef).then(documentSnapshot => {
        const data = {
          ...documentSnapshot.data()
        };
        setTables(data.tables);
      });
      const q = query(collection(db, "wedding"));
      getDocs(q)
        .then(documentSnapshot => {
          const familyData: FamilyData[] = [];
          documentSnapshot.docs.forEach(doc => {
            const data = { id: doc.id, ...doc.data() } as FamilyData;
            familyData.push(data);
          });
          setFamilies(familyData);
        })
        .catch((err) => {
          console.error("Error loading restaurant family data:", err);
        });
    });
  }, []);
  useEffect(() => {
    loadData();
  }, [loadData]);
  return [tables, families, loadData] as const;
};

export const useUpdateTables = () => {
  return useCallback(async (tables: RestaurantTable[]) => {
    try {
      const auth = getAuth(firebaseApp);
      await signInAnonymously(auth);
      const docRef = doc(db, "tables", "tables");
      await setDoc(docRef, { tables });
    } catch (error) {
      console.error(error);
    }
  }, []);
};
