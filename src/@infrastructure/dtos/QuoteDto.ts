export interface QuoteDto {
  id: string;
  quoteNumber: string;
  isForfait: boolean;
  forfaitAmount: number | null;
  startDate: string; // 🔹 ISO String (format pour le stockage en BDD et transmission API)
  endDate: string; // 🔹 ISO String (idem)
  status: 'pending' | 'cancel' | 'draft' | 'validated' | 'accepted' | 'signed' | 'sent' | 'draft';
  country: string;
  currency: string;
  isSent: boolean;
  sentAt: string | null; // 🔹 Peut être null
  carBrand: string;
  carId: string;
  carDate: number;
  technicianId: string;
  garageId: string;
  userId: string; // 🔹 Ajout pour suivre le créateur du devis
}
