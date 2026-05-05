import { renderHook, waitFor } from "@testing-library/react";
import { useBankConfig } from "../useBankConfig";
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

describe("useBankConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return initial loading state", () => {
    mockGetDoc.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useBankConfig());

    expect(result.current.loading).toBe(true);
    expect(result.current.config).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("should load bank config successfully", async () => {
    const mockBankData = {
      iban: "IT00X0000000000000000000000",
      owner: "Alessio Sopranzi",
      bicSwift: "BCITITMM"
    };

    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockBankData
    } as any);

    const { result } = renderHook(() => useBankConfig());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.loading).toBe(false);
    expect(result.current.config).toEqual(mockBankData);
    expect(result.current.error).toBe(null);
  });

  it("should handle missing config", async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: () => false
    } as any);

    const { result } = renderHook(() => useBankConfig());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.loading).toBe(false);
    expect(result.current.config).toBe(null);
    expect(result.current.error).toBe("Bank configuration not found");
  });

  it("should handle firebase errors", async () => {
    const errorMessage = "Firebase connection failed";
    mockGetDoc.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useBankConfig());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.loading).toBe(false);
    expect(result.current.config).toBe(null);
    expect(result.current.error).toBe(errorMessage);
  });
});