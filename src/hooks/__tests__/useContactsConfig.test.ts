import { renderHook, waitFor } from "@testing-library/react";
import { useContactsConfig } from "../useContactsConfig";
import { getDoc } from "firebase/firestore";

// Mock Firebase
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock("../../App", () => ({
  db: {}
}));

const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;

describe("useContactsConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return initial loading state", () => {
    mockGetDoc.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useContactsConfig());

    expect(result.current.loading).toBe(true);
    expect(result.current.contacts).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it("should load contacts successfully", async () => {
    const mockContactsData = {
      whatsAppContacts: [
        {
          name: "Beatrice",
          number: "+393331983242",
          message: "Ciao! Ti contatto per il matrimonio 💒",
          image: "./header/beatrice.svg"
        },
        {
          name: "Alessio",
          number: "+393201950043",
          message: "Ciao! Ti contatto per il matrimonio 💒",
          image: "./header/alessio.svg"
        }
      ]
    };

    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockContactsData
    } as any);

    const { result } = renderHook(() => useContactsConfig());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.loading).toBe(false);
    expect(result.current.contacts).toEqual(mockContactsData.whatsAppContacts);
    expect(result.current.error).toBe(null);
  });

  it("should handle missing config", async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => false
    } as any);

    const { result } = renderHook(() => useContactsConfig());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.loading).toBe(false);
    expect(result.current.contacts).toEqual([]);
    expect(result.current.error).toBe("Contacts configuration not found");
  });

  it("should handle firebase errors", async () => {
    const errorMessage = "Firebase connection failed";
    mockGetDoc.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useContactsConfig());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.loading).toBe(false);
    expect(result.current.contacts).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  it("should handle empty whatsAppContacts array", async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ whatsAppContacts: [] })
    } as any);

    const { result } = renderHook(() => useContactsConfig());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.loading).toBe(false);
    expect(result.current.contacts).toEqual([]);
    expect(result.current.error).toBe(null);
  });
});