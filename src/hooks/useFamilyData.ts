import { useCallback, useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, firebaseApp } from "../App";
import { dummyData, FamilyData, setDummyData } from "../types/family";
import { isDev } from "../utils/env";
import { getAuth, signInAnonymously } from "firebase/auth";
import { useWedding } from "./useWedding";

type FamilyDataError = {
  kind: "error";
  reason: "unknown" | "no-family-id-provided" | "unknown-family-id";
};

type FamilyDataSuccess = {
  kind: "success";
  data: FamilyData;
};

export const useFamilyData = () => {
  const [data, setData] = useState<
    FamilyDataSuccess | FamilyDataError | undefined
  >();
  const wedding = useWedding();

  useEffect(() => {
    const url = new URL(window.location.href).pathname.replace("/", "");
    if (!url) {
      if (isDev) {
        setData({ kind: "success", data: dummyData });
        return;
      }
      setData({
        kind: "error",
        reason: "no-family-id-provided"
      });
      return;
    }
    signInAnonymously(getAuth(firebaseApp))
      .then(() => {
        const docRef = doc(db, "wedding", url);
        getDoc(docRef)
          .then(documentSnapshot => {
            if (documentSnapshot.exists()) {
              setData({
                kind: "success",
                data: documentSnapshot.data() as FamilyData
              });
            } else {
              setData({ kind: "error", reason: "unknown-family-id" });
            }
          })
          .catch(error => {
            setData({ kind: "error", reason: error });
          });
      })
      .catch(console.error);
  }, [wedding.isWeddingStarted]);
  return data;
};

export const useUpdateFamilyData = (familyId: string) => {
  const docRef = doc(db, "wedding", familyId);
  const { isWeddingStarted } = useWedding();
  return useCallback(
    async (familyData: FamilyData) => {
      if (isWeddingStarted) {
        return;
      }
      if (familyId === "DUMMYDATA" && process.env.NODE_ENV === "development") {
        setDummyData(familyData);
        return;
      }
      await updateDoc(docRef, familyData);
    },
    [docRef, familyId]
  );
};

export const useUpdateFamilyDataEnhanced = () => {
  const { isWeddingStarted } = useWedding();
  return useCallback(
    (familyId: string) => async (familyData: FamilyData) => {
      if (isWeddingStarted) {
        return;
      }
      const docRef = doc(db, "wedding", familyId);
      await updateDoc(docRef, familyData);
    },
    []
  );
};

export const useAddFamilyData = () => {
  return useCallback(async (data: FamilyData) => {
    try {
      const auth = getAuth(firebaseApp);
      await signInAnonymously(auth);
      const docRef = doc(db, "wedding", data.id);
      await setDoc(docRef, data);
    } catch (error) {
      console.error(error);
    }
  }, []);
};
