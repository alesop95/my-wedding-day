export type RSVPSummary = {
  total: number;
  confirmed: number; // "yes"
  declined: number;  // "no"
  maybe: number;     // "maybe"
  pending: number;   // "unknown"
  confirmationRate: number; // percentage
};

export type SideSummary = {
  alessio: RSVPSummary;
  beatrice: RSVPSummary;
  unknown: RSVPSummary; // families without side specified
};

export type GiftSummary = {
  totalFamilies: number;
  totalGifts: number;
  totalDonations: number;
  averageGift: number;
  averageDonation: number;
};

export type AllergiesData = {
  memberId: string;
  familyId: string;
  memberName: string;
  allergies: string[];
  dietaryNotes?: string;
};

export type CocktailPreference = {
  memberId: string;
  familyId: string;
  memberName: string;
  preference: string;
};

export type DashboardData = {
  rsvpSummary: RSVPSummary;
  sideSummary: SideSummary;
  giftSummary: GiftSummary;
  allergiesList: AllergiesData[];
  cocktailPreferences: CocktailPreference[];
  lastUpdated: Date;
};

export type ChartData = {
  name: string;
  value: number;
  color?: string;
};

export type BarChartData = {
  side: string;
  confirmed: number;
  declined: number;
  maybe: number;
  pending: number;
};