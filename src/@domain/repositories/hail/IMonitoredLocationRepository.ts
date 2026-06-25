import { MonitoredLocationDto } from '@/@application/dtos/hail/MonitoredLocationDto';

export interface IMonitoredLocationRepository {
  getByOrganizationId(organizationId: string): Promise<MonitoredLocationDto[]>;
  create(location: MonitoredLocationDto): Promise<MonitoredLocationDto>;
  delete(id: string): Promise<void>;
}
