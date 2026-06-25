import { Ref, ComputedRef } from 'vue';
import { HailAlertDto } from '@/@application/dtos/hail/HailAlertDto';
import { MonitoredLocationDto } from '@/@application/dtos/hail/MonitoredLocationDto';

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
