export interface UserApiModel {
  id?: string;
  email: string;
  full_name: string;
  role: 'technician' | 'garage' | 'admin'; // mise à jour ici
}