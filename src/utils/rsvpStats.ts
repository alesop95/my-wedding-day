import { FamilyData, FamilyMember } from "../types/family";
import {
  RSVPSummary,
  SideSummary,
  GiftSummary,
  AllergiesData,
  CocktailPreference,
  DashboardData,
  ChartData,
  BarChartData
} from "../types/dashboard";

// Helper function to generate unique member ID
const getMemberId = (familyId: string, memberIndex: number): string => {
  return `${familyId}_${memberIndex}`;
};

// Calculate RSVP summary for a list of members
export const calculateRSVPSummary = (members: FamilyMember[]): RSVPSummary => {
  const total = members.length;
  const confirmed = members.filter(m => m.rsvp === "yes").length;
  const declined = members.filter(m => m.rsvp === "no").length;
  const maybe = members.filter(m => m.rsvp === "maybe").length;
  const pending = members.filter(m => m.rsvp === "unknown").length;

  const confirmationRate = total > 0 ? (confirmed / total) * 100 : 0;

  return {
    total,
    confirmed,
    declined,
    maybe,
    pending,
    confirmationRate: Math.round(confirmationRate * 100) / 100 // Round to 2 decimals
  };
};

// Calculate summary by side (Alessio/Beatrice/Unknown)
export const calculateSideSummary = (families: FamilyData[]): SideSummary => {
  const alessioFamilies = families.filter(f => f.side === "Alessio");
  const beatriceFamilies = families.filter(f => f.side === "Beatrice");
  const unknownFamilies = families.filter(f => !f.side);

  const alessioMembers = alessioFamilies.flatMap(f => f.members);
  const beatriceMembers = beatriceFamilies.flatMap(f => f.members);
  const unknownMembers = unknownFamilies.flatMap(f => f.members);

  return {
    alessio: calculateRSVPSummary(alessioMembers),
    beatrice: calculateRSVPSummary(beatriceMembers),
    unknown: calculateRSVPSummary(unknownMembers)
  };
};

// Calculate gift summary
export const calculateGiftSummary = (families: FamilyData[]): GiftSummary => {
  const totalFamilies = families.length;
  const giftsData = families.filter(f => f.gift && f.gift > 0);
  const donationsData = families.filter(f => f.donation && f.donation > 0);

  const totalGifts = giftsData.reduce((sum, f) => sum + (f.gift || 0), 0);
  const totalDonations = donationsData.reduce((sum, f) => sum + (f.donation || 0), 0);

  const averageGift = giftsData.length > 0 ? totalGifts / giftsData.length : 0;
  const averageDonation = donationsData.length > 0 ? totalDonations / donationsData.length : 0;

  return {
    totalFamilies,
    totalGifts: Math.round(totalGifts * 100) / 100,
    totalDonations: Math.round(totalDonations * 100) / 100,
    averageGift: Math.round(averageGift * 100) / 100,
    averageDonation: Math.round(averageDonation * 100) / 100
  };
};

// Extract allergies data from families
export const extractAllergiesData = (families: FamilyData[]): AllergiesData[] => {
  const allergiesData: AllergiesData[] = [];

  families.forEach(family => {
    family.members.forEach((member, index) => {
      if (member.allergies && member.allergies.length > 0) {
        allergiesData.push({
          memberId: getMemberId(family.id, index),
          familyId: family.id,
          memberName: `${member.firstName} ${member.lastName}`,
          allergies: member.allergies,
          dietaryNotes: member.dietaryNotes
        });
      }
    });
  });

  return allergiesData;
};

// Extract cocktail preferences from families
export const extractCocktailPreferences = (families: FamilyData[]): CocktailPreference[] => {
  const preferences: CocktailPreference[] = [];

  families.forEach(family => {
    family.members.forEach((member, index) => {
      if (member.drinkPreference && member.drinkPreference.trim()) {
        preferences.push({
          memberId: getMemberId(family.id, index),
          familyId: family.id,
          memberName: `${member.firstName} ${member.lastName}`,
          preference: member.drinkPreference
        });
      }
    });
  });

  return preferences;
};

// Generate complete dashboard data
export const generateDashboardData = (families: FamilyData[]): DashboardData => {
  const allMembers = families.flatMap(f => f.members);

  return {
    rsvpSummary: calculateRSVPSummary(allMembers),
    sideSummary: calculateSideSummary(families),
    giftSummary: calculateGiftSummary(families),
    allergiesList: extractAllergiesData(families),
    cocktailPreferences: extractCocktailPreferences(families),
    lastUpdated: new Date()
  };
};

// Convert RSVP summary to pie chart data
export const rsvpToPieChartData = (summary: RSVPSummary): ChartData[] => [
  { name: "Confermati", value: summary.confirmed, color: "#4caf50" },
  { name: "Rifiutati", value: summary.declined, color: "#f44336" },
  { name: "Forse", value: summary.maybe, color: "#ff9800" },
  { name: "In attesa", value: summary.pending, color: "#9e9e9e" }
];

// Convert side summary to bar chart data
export const sideToBarChartData = (sideSummary: SideSummary): BarChartData[] => [
  {
    side: "Alessio",
    confirmed: sideSummary.alessio.confirmed,
    declined: sideSummary.alessio.declined,
    maybe: sideSummary.alessio.maybe,
    pending: sideSummary.alessio.pending
  },
  {
    side: "Beatrice",
    confirmed: sideSummary.beatrice.confirmed,
    declined: sideSummary.beatrice.declined,
    maybe: sideSummary.beatrice.maybe,
    pending: sideSummary.beatrice.pending
  }
];

// Group cocktail preferences by type for analysis
export const groupCocktailPreferences = (preferences: CocktailPreference[]): Record<string, number> => {
  const grouped: Record<string, number> = {};

  preferences.forEach(pref => {
    const drink = pref.preference.toLowerCase().trim();
    grouped[drink] = (grouped[drink] || 0) + 1;
  });

  return grouped;
};

// Group allergies by type for analysis
export const groupAllergies = (allergiesData: AllergiesData[]): Record<string, number> => {
  const grouped: Record<string, number> = {};

  allergiesData.forEach(data => {
    data.allergies.forEach(allergy => {
      const allergyKey = allergy.toLowerCase().trim();
      grouped[allergyKey] = (grouped[allergyKey] || 0) + 1;
    });
  });

  return grouped;
};