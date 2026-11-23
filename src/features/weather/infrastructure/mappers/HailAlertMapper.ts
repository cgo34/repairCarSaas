import { HailAlertApiModel } from '@/features/weather/infrastructure/api/HailAlertApiModel';
import { HailAlertDto } from '@/features/weather/application/dtos/HailAlertDto';

export class HailAlertMapper {
  static apiToDto(api: HailAlertApiModel): HailAlertDto {
    return {
      id: api.id,
      departmentId: api.department_id,
      departmentCode: api.hail_departments?.code ?? '',
      departmentName: api.hail_departments?.name ?? '',
      lat: api.hail_departments?.lat ?? 0,
      lon: api.hail_departments?.lon ?? 0,
      riskLevel: api.risk_level,
      capeValue: api.cape_value,
      weatherCode: api.weather_code,
      vigilanceLevel: api.vigilance_level,
      lastCheckedAt: api.last_checked_at,
    };
  }
}
