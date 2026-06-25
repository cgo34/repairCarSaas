export interface HailAlertApiModel {
  id: string;
  department_id: string;
  risk_level: 'none' | 'moderate' | 'high' | 'active';
  cape_value: number | null;
  weather_code: number | null;
  vigilance_level: 'none' | 'yellow' | 'orange' | 'red';
  last_checked_at: string;
  hail_departments: {
    id: string;
    code: string;
    name: string;
    lat: number;
    lon: number;
    country_code: string;
  } | null;
}
