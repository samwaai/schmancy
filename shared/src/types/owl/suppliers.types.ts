// import { v4 as uuidv4 } from "uuid";

// Define the Supplier interface

// Supplier class with default values
export class Supplier {
  id: string | undefined;
  name: string = "";
  abbreviation?: string; // Optional short name for display in chips
  address: string | null = null;
  // Bank information
  bankIBAN: string | null = null;
  bankIBAN2: string | null = null; // Added second IBAN field
  bankName: string | null = null;
  bankSWIFT: string | null = null;
  // Personal Contact information
  email: string = "";
  contactName: string = "";
  contactPhone: string = "";
  contactEmail: string = "";

  minimumOrderValue?: number = 0;

  cc?: string[];
  clients: string[];
  constructor(orgId: string) {
    this.clients = [orgId];
  }
}
