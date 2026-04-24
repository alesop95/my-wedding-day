import { renderHook, waitFor } from "@testing-library/react";
import { doc, getDoc } from "firebase/firestore";
import { usePlaylist } from "../usePlaylist";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn()
}));

jest.mock("../../App", () => ({
  db: {}
}));

jest.mock("../useTestingMode", () => ({
  useTestingMode: jest.fn()
}));

import { useTestingMode } from "../useTestingMode";

const mockedGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockedDoc = doc as jest.MockedFunction<typeof doc>;
const mockedUseTestingMode = useTestingMode as jest.MockedFunction<typeof useTestingMode>;

const defaultTestingMode = {
  isTestingMode: false,
  source: "disabled" as const,
  forceAtHomeVisible: false,
  forceRSVPVisible: false,
  forceHotelVisible: false,
  forceGuestbookVisible: false,
  forcePhotoSharingVisible: false,
  forcePlaylistVisible: false
};

const makeSnapshot = (exists: boolean, data?: Record<string, unknown>) =>
  ({
    exists: () => exists,
    data: () => data
  } as any);

describe("usePlaylist", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedDoc.mockReturnValue({} as any);
    mockedUseTestingMode.mockReturnValue(defaultTestingMode);
  });

  it("starts with loading=true and empty config", () => {
    mockedGetDoc.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePlaylist());
    expect(result.current.loading).toBe(true);
    expect(result.current.config).toBeNull();
    expect(result.current.hasConfig).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  it("loads a valid enabled config and exposes spotifyUrl", async () => {
    mockedGetDoc.mockResolvedValue(
      makeSnapshot(true, {
        spotifyUrl: "https://open.spotify.com/playlist/ABC123",
        enabled: true
      })
    );

    const { result } = renderHook(() => usePlaylist());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasConfig).toBe(true);
    expect(result.current.isEnabled).toBe(true);
    expect(result.current.spotifyUrl).toBe("https://open.spotify.com/playlist/ABC123");
    expect(result.current.isVisible).toBe(true);
  });

  it("returns isVisible=false when config is disabled", async () => {
    mockedGetDoc.mockResolvedValue(
      makeSnapshot(true, {
        spotifyUrl: "https://open.spotify.com/playlist/ABC123",
        enabled: false
      })
    );

    const { result } = renderHook(() => usePlaylist());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasConfig).toBe(true);
    expect(result.current.isEnabled).toBe(false);
    expect(result.current.isVisible).toBe(false);
  });

  it("returns isVisible=false when Firestore document does not exist", async () => {
    mockedGetDoc.mockResolvedValue(makeSnapshot(false));

    const { result } = renderHook(() => usePlaylist());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasConfig).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(result.current.isVisible).toBe(false);
  });

  it("reports an error when config shape is invalid", async () => {
    mockedGetDoc.mockResolvedValue(
      makeSnapshot(true, {
        spotifyUrl: 42,
        enabled: "yes"
      })
    );

    const { result } = renderHook(() => usePlaylist());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasConfig).toBe(false);
    expect(result.current.hasError).toBe(true);
    expect(result.current.error).toBe("Invalid playlist configuration");
  });

  it("reports an error when Firestore throws", async () => {
    mockedGetDoc.mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => usePlaylist());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasConfig).toBe(false);
    expect(result.current.hasError).toBe(true);
    expect(result.current.error).toBe("Failed to load playlist configuration");
  });

  it("keeps isVisible=false when testing override is on but admin config is disabled", async () => {
    // Regola architetturale: il testing mode bypassa la logica temporale,
    // MAI la scelta dell'admin (enabled=false resta nascosto).
    mockedUseTestingMode.mockReturnValue({
      ...defaultTestingMode,
      isTestingMode: true,
      forcePlaylistVisible: true
    });
    mockedGetDoc.mockResolvedValue(
      makeSnapshot(true, {
        spotifyUrl: "https://open.spotify.com/playlist/ABC123",
        enabled: false
      })
    );

    const { result } = renderHook(() => usePlaylist());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isVisible).toBe(false);
  });
});
