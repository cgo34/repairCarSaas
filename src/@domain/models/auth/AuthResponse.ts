export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    created_at: string;
    // autres champs nécessaires pour le domain
  };
  session?: {
    access_token: string;
    expires_at: number;
  };
}