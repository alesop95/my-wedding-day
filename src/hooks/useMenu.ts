import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../App";
import { MenuItem, MenuBycourse, CourseType } from "../types/menu";
import { function as F } from "fp-ts";
import { option as O } from "fp-ts";

type UseMenuResult = {
  menuItems: MenuItem[];
  menuByCourse: MenuBycourse;
  loading: boolean;
  error: O.Option<Error>;
};

export const useMenu = (): UseMenuResult => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<O.Option<Error>>(O.none);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(O.none);

        const menuQuery = query(
          collection(db, "menu"),
          orderBy("order", "asc")
        );

        const querySnapshot = await getDocs(menuQuery);
        const items: MenuItem[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            course: data.course as CourseType,
            name: data.name,
            description: data.description,
            allergens: data.allergens || [],
            order: data.order
          });
        });

        setMenuItems(items);
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError(O.some(err as Error));
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Group items by course
  const menuByCourse: MenuBycourse = F.pipe(
    menuItems,
    (items) => items.reduce<MenuBycourse>((acc, item) => {
      acc[item.course].push(item);
      return acc;
    }, {
      antipasto: [],
      primo: [],
      secondo: [],
      dolce: [],
      bevande: []
    })
  );

  return {
    menuItems,
    menuByCourse,
    loading,
    error
  };
};