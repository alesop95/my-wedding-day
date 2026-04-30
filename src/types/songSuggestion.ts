export interface SongSuggestion {
  id: string;
  familyId: string;
  authorName: string;
  songTitle: string;
  artist: string;
  note?: string;
  createdAt: Date;
}
