import { renderHook, waitFor } from "@testing-library/react";
import {
  collection,
  getDocs,
  orderBy,
  query
} from "firebase/firestore";
import { useMenu } from "../useMenu";

// Mock Firebase
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn()
}));

jest.mock("../../App", () => ({
  db: {}
}));

const mockedGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockedCollection = collection as jest.MockedFunction<typeof collection>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedOrderBy = orderBy as jest.MockedFunction<typeof orderBy>;

describe("useMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedCollection.mockReturnValue({} as any);
    mockedQuery.mockReturnValue({} as any);
    mockedOrderBy.mockReturnValue({} as any);
  });

  it("starts with loading=true and empty menu", () => {
    mockedGetDocs.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useMenu());

    expect(result.current.loading).toBe(true);
    expect(result.current.menuItems).toEqual([]);
    expect(result.current.error._tag).toBe("None");
  });

  it("loads menu items from Firestore successfully", async () => {
    const mockMenuItems = [
      {
        id: "item1",
        data: () => ({
          course: "antipasto",
          name: "Bruschetta",
          description: "Pomodoro e basilico",
          allergens: ["glutine"],
          order: 1
        })
      },
      {
        id: "item2",
        data: () => ({
          course: "primo",
          name: "Risotto",
          description: "Ai funghi porcini",
          allergens: [],
          order: 2
        })
      }
    ];

    mockedGetDocs.mockResolvedValue({
      forEach: (callback: any) => {
        mockMenuItems.forEach(callback);
      }
    } as any);

    const { result } = renderHook(() => useMenu());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.menuItems).toHaveLength(2);
    expect(result.current.menuItems[0].name).toBe("Bruschetta");
    expect(result.current.menuItems[1].course).toBe("primo");
    expect(result.current.error._tag).toBe("None");
  });

  it("groups menu items by course correctly", async () => {
    const mockMenuItems = [
      {
        id: "item1",
        data: () => ({
          course: "antipasto",
          name: "Bruschetta",
          description: "Pomodoro e basilico",
          allergens: [],
          order: 1
        })
      },
      {
        id: "item2",
        data: () => ({
          course: "antipasto",
          name: "Carpaccio",
          description: "Di manzo",
          allergens: [],
          order: 2
        })
      },
      {
        id: "item3",
        data: () => ({
          course: "primo",
          name: "Risotto",
          description: "Ai funghi",
          allergens: [],
          order: 3
        })
      }
    ];

    mockedGetDocs.mockResolvedValue({
      forEach: (callback: any) => {
        mockMenuItems.forEach(callback);
      }
    } as any);

    const { result } = renderHook(() => useMenu());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.menuByCourse.antipasto).toHaveLength(2);
    expect(result.current.menuByCourse.primo).toHaveLength(1);
    expect(result.current.menuByCourse.secondo).toHaveLength(0);
    expect(result.current.menuByCourse.antipasto[0].name).toBe("Bruschetta");
    expect(result.current.menuByCourse.primo[0].name).toBe("Risotto");
  });

  it("handles Firestore errors gracefully", async () => {
    const mockError = new Error("Network error");
    mockedGetDocs.mockRejectedValue(mockError);

    const { result } = renderHook(() => useMenu());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error._tag).toBe("Some");
    if (result.current.error._tag === "Some") {
      expect(result.current.error.value.message).toBe("Network error");
    }
    expect(result.current.menuItems).toEqual([]);
  });

  it("handles missing allergens field gracefully", async () => {
    const mockMenuItems = [
      {
        id: "item1",
        data: () => ({
          course: "antipasto",
          name: "Bruschetta",
          description: "Pomodoro e basilico",
          // allergens field missing
          order: 1
        })
      }
    ];

    mockedGetDocs.mockResolvedValue({
      forEach: (callback: any) => {
        mockMenuItems.forEach(callback);
      }
    } as any);

    const { result } = renderHook(() => useMenu());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.menuItems[0].allergens).toEqual([]);
  });
});