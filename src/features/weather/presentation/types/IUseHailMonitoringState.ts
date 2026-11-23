import { Ref, ComputedRef } from 'vue';
import { HailAlertDto } from '@/features/weather/application/dtos/HailAlertDto';
import { MonitoredLocationDto } from '@/features/weather/application/dtos/MonitoredLocationDto';

export interface IUseHailMonitoringState {
  alerts: Ref<HailAlertDto[]>;
  activeAlerts: ComputedRef<HailAlertDto[]>;
  monitoredLocations: Ref<MonitoredLocationDto[]>;
  loading: Ref<boolean>;
  hasActiveAlerts: ComputedRef<boolean>;
  fetchAlerts(): Promise<void>;
  fetchMonitoredLocations(): Promise<void>;
  addLocation(location: Omit<MonitoredLocationDto, 'id' | 'createdAt'>): Promise<void>;
  removeLocation(id: string): Promise<void>;
}
