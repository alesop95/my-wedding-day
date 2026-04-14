/**
 * this hook is used to check if the app needs to be refreshed
 * it stores the last time the page has been refreshed in local storage
 * if it's been more than {@param minutes}, it returns true
 * it is executed on window focus.
 * this is particularly useful for those apps that don't use a remote versioning control
 * and where users keep the app open for long periods
 */
import { useCallback, useEffect, useState } from "react";

export const useNeedToRefresh = (minutes: number = 30): boolean => {
  const [needToRefresh, setNeedToRefresh] = useState(false);

  const checkIfNeedToRefresh = useCallback(() => {
    const lastRefresh = localStorage.getItem("lastRefresh");
    const currentDate = new Date();
    if (lastRefresh && !isNaN(Number(lastRefresh))) {
      const lastRefreshDate = Number(lastRefresh);
      const diff = currentDate.getTime() - lastRefreshDate;
      const diffHours = diff / (1000 * 60 * minutes);
      setNeedToRefresh(diffHours > 24);
      localStorage.setItem("lastRefresh", currentDate.getTime().toString());
    } else {
      localStorage.setItem("lastRefresh", currentDate.getTime().toString());
    }
  }, [minutes]);
  useEffect(() => {
    window.addEventListener("focus", checkIfNeedToRefresh);
    return () => {
      window.removeEventListener("focus", () => {});
    };
  }, [checkIfNeedToRefresh]);
  return needToRefresh;
};
