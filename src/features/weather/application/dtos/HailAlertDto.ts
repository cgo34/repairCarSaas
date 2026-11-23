export type HailRiskLevel = 'none' | 'moderate' | 'high' | 'active';
export type HailVigilanceLevel = 'none' | 'yellow' | 'orange' | 'red';

export interface HailAlertDto {
  id: string;
  departmentId: string;
  departmentCode: string;
  departmentName: string;
  lat: number;
  lon: number;
  riskLevel: HailRiskLevel;
  capeValue: number | null;
  weatherCode: number | null;
  vigilanceLevel: HailVigilanceLevel;
  lastCheckedAt: string;
}
