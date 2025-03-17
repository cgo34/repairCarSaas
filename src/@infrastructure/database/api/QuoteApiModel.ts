export interface QuoteApiModel {
  id: string;
  quote_number: string;
  is_forfait: boolean;
  forfait_amount: number | null;
  start_date: string; // Stocké en format ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
  end_date: string;
  status: 'pending' | 'cancel' | 'draft' | 'validated' | 'accepted' | 'signed' | 'sent';
  country: string;
  currency: string;
  is_sent: boolean;
  sent_at: string | null; // NULL si non envoyé
  car_brand: string;
  car_id: string;
  car_date: number;
  technician_id: string;
  garage_id: string;
  user_id: string; // 🔹 ID du créateur du devis
}
