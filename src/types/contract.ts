export interface Contract {
  id: string;
  companyName: string; // Or a more specific identifier if needed
  serviceName: string; // e.g., "EduPlatform License", "Consulting Services"
  startDate: string; // ISO 8601 format date string
  endDate: string; // ISO 8601 format date string
  autoRenew: boolean; // For future use
  totalLicenses: number; // Total number of licenses in the contract
  usedLicenses: number; // Number of licenses currently in use
  // Add other relevant fields like contract value, status, etc. later
}
