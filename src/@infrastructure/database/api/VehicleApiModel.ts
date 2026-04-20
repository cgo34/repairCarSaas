export interface VehicleApiModel {
  id?: string;
  user_id: string;
  garage_id: string;
  marque: string;
  annee: number | null;
  immatriculation: string;
  created_at?: string;
}
