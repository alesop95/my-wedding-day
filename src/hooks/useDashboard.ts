import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../App";
import { FamilyData } from "../types/family";
import { DashboardData } from "../types/dashboard";
import { generateDashboardData } from "../utils/rsvpStats";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";

export type DashboardError = {
  message: string;
  code?: string;
};

export type DashboardState = {
  data: O.Option<DashboardData>;
  loading: boolean;
  error: O.Option<DashboardError>;
};

export const useDashboard = () => {
  const [state, setState] = useState<DashboardState>({
    data: O.none,
    loading: true,
    error: O.none
  });

  useEffect(() => {
    setState(prev => ({ ...prev, loading: true, error: O.none }));

    // Real-time listener for all wedding families
    const unsubscribe = onSnapshot(
      query(collection(db, "wedding"), orderBy("family")),
      (snapshot) => {
        try {
          const families: FamilyData[] = [];

          snapshot.forEach((doc) => {
            const data = doc.data();
            // Ensure the document has the required structure
            if (data.family && data.members && Array.isArray(data.members)) {
              families.push({
                family: data.family,
                side: data.side,
                gift: data.gift,
                donation: data.donation,
                reminderSent: data.reminderSent,
                note: data.note || "",
                id: doc.id,
                linkSent: data.linkSent || false,
                members: data.members,
                onlyInfo: data.onlyInfo || false
              });
            }
          });

          // Generate dashboard data
          const dashboardData = generateDashboardData(families);

          setState({
            data: O.some(dashboardData),
            loading: false,
            error: O.none
          });
        } catch (err) {
          console.error("Error processing dashboard data:", err);
          setState({
            data: O.none,
            loading: false,
            error: O.some({
              message: "Errore nell'elaborazione dei dati dashboard",
              code: "PROCESSING_ERROR"
            })
          });
        }
      },
      (err) => {
        console.error("Error fetching dashboard data:", err);
        setState({
          data: O.none,
          loading: false,
          error: O.some({
            message: "Errore nel caricamento dei dati dashboard",
            code: err.code
          })
        });
      }
    );

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Helper functions to access state data safely
  const getDashboardData = (): DashboardData | null => {
    return O.isSome(state.data) ? state.data.value : null;
  };

  const getError = (): DashboardError | null => {
    return O.isSome(state.error) ? state.error.value : null;
  };

  const isLoading = (): boolean => {
    return state.loading;
  };

  const hasData = (): boolean => {
    return O.isSome(state.data);
  };

  const hasError = (): boolean => {
    return O.isSome(state.error);
  };

  return {
    // Raw state
    state,

    // Data accessors
    data: getDashboardData(),
    error: getError(),
    loading: isLoading(),

    // Status checks
    hasData: hasData(),
    hasError: hasError(),

    // Utility for checking if specific data sections are available
    hasRSVPData: () => hasData() && getDashboardData()?.rsvpSummary != null,
    hasAllergiesData: () => hasData() && getDashboardData()?.allergiesList != null,
    hasCocktailData: () => hasData() && getDashboardData()?.cocktailPreferences != null,
  };
};