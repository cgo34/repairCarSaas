import { GarageApiModel } from "./GarageApiModel";
import { UserApiModel } from "./UserApiModel";

export interface QuoteApiModel {
  id?: string;
  quote_number: string;
  is_forfait: boolean;
  forfait_amount: number | null;
  is_display_unit_price: boolean;
  is_compute_commission_without_dent_removal: boolean;
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
  technician?: UserApiModel
  garage_id: string | null;
  garage?: GarageApiModel
  user_id: string; // 🔹 ID du créateur du devis
  user?: UserApiModel;
  created_at?: string;
  
  // garage info for first level subscription users
  garage_name?: string;
  garage_address?: string;
  garage_zip_code?: string;
  garage_city?: string;
  garage_phone?: string;
  garage_email?: string;
  garage_percentage_commission?: number;
}
