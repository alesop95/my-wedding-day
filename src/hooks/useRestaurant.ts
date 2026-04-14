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

export const isPrinting = false;
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
        .catch(() => {});
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
