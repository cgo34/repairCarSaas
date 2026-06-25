export interface SettingPriceGeneralApiModel {
  id?: string; // UUID
  organization_id: string;
  hourly_rate: number;
  unit_time: number;
}
