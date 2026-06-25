import { MonitoredLocationApiModel } from '@/@infrastructure/database/api/hail/MonitoredLocationApiModel';
import { MonitoredLocationDto } from '@/@application/dtos/hail/MonitoredLocationDto';

export class MonitoredLocationMapper {
  static apiToDto(api: MonitoredLocationApiModel): MonitoredLocationDto {
    return {
      id: api.id,
      organizationId: api.organization_id,
      cityName: api.city_name,
      lat: api.lat,
      lon: api.lon,
      countryCode: api.country_code,
      createdAt: api.created_at,
    };
  }

  static dtoToApi(dto: MonitoredLocationDto): Partial<MonitoredLocationApiModel> {
    return {
      organization_id: dto.organizationId,
      city_name: dto.cityName,
      lat: dto.lat,
      lon: dto.lon,
      country_code: dto.countryCode,
    };
  }
}
