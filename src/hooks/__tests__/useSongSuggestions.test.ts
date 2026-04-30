import { renderHook, act, waitFor } from "@testing-library/react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => "__server_timestamp__")
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  signInAnonymously: jest.fn()
}));

jest.mock("../../App", () => ({
  db: {},
  firebaseApp: {}
}));

jest.mock("../useFamilyData", () => ({
  useFamilyData: jest.fn()
}));

import { useFamilyData } from "../useFamilyData";
import { useSongSuggestions } from "../useSongSuggestions";

const mockedAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockedCollection = collection as jest.MockedFunction<typeof collection>;
const mockedOnSnapshot = onSnapshot as jest.MockedFunction<typeof onSnapshot>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedOrderBy = orderBy as jest.MockedFunction<typeof orderBy>;
const mockedSignIn = signInAnonymously as jest.MockedFunction<typeof signInAnonymously>;
const mockedServerTimestamp = serverTimestamp as jest.MockedFunction<typeof serverTimestamp>;
const mockedUseFamilyData = useFamilyData as jest.MockedFunction<typeof useFamilyData>;

const setFamily = (familyId: string | null) => {
  if (familyId === null) {
    mockedUseFamilyData.mockReturnValue({
      kind: "error",
      reason: "no-family-id-provided"
    } as any);
  } else {
    mockedUseFamilyData.mockReturnValue({
      kind: "success",
      data: { id: familyId }
    } as any);
  }
};

describe("useSongSuggestions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedCollection.mockReturnValue({} as any);
    mockedQuery.mockReturnValue({} as any);
    mockedOrderBy.mockReturnValue({} as any);
    mockedSignIn.mockResolvedValue({} as any);
    mockedServerTimestamp.mockReturnValue("__server_timestamp__" as any);
    // Default: onSnapshot non invoca callback (loading stays true)
    mockedOnSnapshot.mockReturnValue(() => {});
    setFamily("test-family-123");
  });

  it("starts with loading=true and empty suggestions", () => {
    const { result } = renderHook(() => useSongSuggestions());
    expect(result.current.loading).toBe(true);
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("populates suggestions from Firestore snapshot", async () => {
    mockedOnSnapshot.mockImplementation((_q: any, onNext: any) => {
      onNext({
        docs: [
          {
            id: "s1",
            data: () => ({
              familyId: "F1",
              authorName: "Alice",
              songTitle: "Song A",
              artist: "Artist A",
              note: "dedica",
              createdAt: { toDate: () => new Date("2026-04-20T10:00:00Z") }
            })
          },
          {
            id: "s2",
            data: () => ({
              familyId: "F2",
              authorName: "Bob",
              songTitle: "Song B",
              artist: "Artist B",
              createdAt: { toDate: () => new Date("2026-04-21T10:00:00Z") }
            })
          }
        ]
      });
      return () => {};
    });

    const { result } = renderHook(() => useSongSuggestions());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.suggestions).toHaveLength(2);
    expect(result.current.suggestions[0].songTitle).toBe("Song A");
    expect(result.current.suggestions[0].note).toBe("dedica");
    expect(result.current.suggestions[1].note).toBeUndefined();
  });

  it("flags canSendSuggestion=true when family is loaded", () => {
    const { result } = renderHook(() => useSongSuggestions());
    expect(result.current.canSendSuggestion).toBe(true);
  });

  it("flags canSendSuggestion=false when no familyId", () => {
    setFamily(null);
    const { result } = renderHook(() => useSongSuggestions());
    expect(result.current.canSendSuggestion).toBe(false);
  });

  it("addSuggestion rejects empty songTitle", async () => {
    const { result } = renderHook(() => useSongSuggestions());
    const out = await act(() =>
      result.current.addSuggestion({
        authorName: "Alice",
        songTitle: "   ",
        artist: "Artist"
      })()
    );
    expect(out._tag).toBe("Left");
    if (out._tag === "Left") {
      expect(out.left.message).toMatch(/titolo/i);
    }
    expect(mockedAddDoc).not.toHaveBeenCalled();
  });

  it("addSuggestion rejects empty artist", async () => {
    const { result } = renderHook(() => useSongSuggestions());
    const out = await act(() =>
      result.current.addSuggestion({
        authorName: "Alice",
        songTitle: "Song",
        artist: ""
      })()
    );
    expect(out._tag).toBe("Left");
    if (out._tag === "Left") {
      expect(out.left.message).toMatch(/artista/i);
    }
  });

  it("addSuggestion rejects empty authorName", async () => {
    const { result } = renderHook(() => useSongSuggestions());
    const out = await act(() =>
      result.current.addSuggestion({
        authorName: "",
        songTitle: "Song",
        artist: "Artist"
      })()
    );
    expect(out._tag).toBe("Left");
    if (out._tag === "Left") {
      expect(out.left.message).toMatch(/nome/i);
    }
  });

  it("addSuggestion writes to Firestore without note when note is empty", async () => {
    mockedAddDoc.mockResolvedValue({ id: "new" } as any);
    const { result } = renderHook(() => useSongSuggestions());

    const out = await act(() =>
      result.current.addSuggestion({
        authorName: "  Alice  ",
        songTitle: "  Song A  ",
        artist: "  Artist A  "
      })()
    );

    expect(out._tag).toBe("Right");
    expect(mockedAddDoc).toHaveBeenCalledTimes(1);
    const payload = mockedAddDoc.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.familyId).toBe("test-family-123");
    expect(payload.authorName).toBe("Alice");
    expect(payload.songTitle).toBe("Song A");
    expect(payload.artist).toBe("Artist A");
    expect(payload.createdAt).toBe("__server_timestamp__");
    expect(payload.note).toBeUndefined();
  });

  it("addSuggestion writes trimmed note when provided", async () => {
    mockedAddDoc.mockResolvedValue({ id: "new" } as any);
    const { result } = renderHook(() => useSongSuggestions());

    await act(() =>
      result.current.addSuggestion({
        authorName: "Alice",
        songTitle: "Song A",
        artist: "Artist A",
        note: "  per i nostri ricordi  "
      })()
    );

    const payload = mockedAddDoc.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.note).toBe("per i nostri ricordi");
  });

  it("addSuggestion fails gracefully when Firestore throws", async () => {
    mockedAddDoc.mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useSongSuggestions());

    const out = await act(() =>
      result.current.addSuggestion({
        authorName: "Alice",
        songTitle: "Song",
        artist: "Artist"
      })()
    );

    expect(out._tag).toBe("Left");
    if (out._tag === "Left") {
      expect(out.left.message).toBe("network down");
    }
  });

  it("addSuggestion fails when family is missing", async () => {
    setFamily(null);
    const { result } = renderHook(() => useSongSuggestions());

    const out = await act(() =>
      result.current.addSuggestion({
        authorName: "Alice",
        songTitle: "Song",
        artist: "Artist"
      })()
    );

    expect(out._tag).toBe("Left");
    if (out._tag === "Left") {
      expect(out.left.message).toMatch(/famiglia/i);
    }
    expect(mockedAddDoc).not.toHaveBeenCalled();
  });
});
