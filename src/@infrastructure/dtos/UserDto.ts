export interface UserDto {
  id?: string;
  email: string;
  fullName: string;
  role: 'technician' | 'garage' | 'admin'; // mise à jour ici
}