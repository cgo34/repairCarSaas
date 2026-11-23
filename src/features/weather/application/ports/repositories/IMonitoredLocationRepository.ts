import { MonitoredLocationDto } from '@/features/weather/application/dtos/MonitoredLocationDto';

export interface IMonitoredLocationRepository {
  getByOrganizationId(organizationId: string): Promise<MonitoredLocationDto[]>;
  create(location: MonitoredLocationDto): Promise<MonitoredLocationDto>;
  delete(id: string): Promise<void>;
}
