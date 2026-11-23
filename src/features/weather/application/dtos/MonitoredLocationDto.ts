export interface MonitoredLocationDto {
  id?: string;
  organizationId: string;
  cityName: string;
  lat: number;
  lon: number;
  countryCode: string;
  createdAt?: string;
}
