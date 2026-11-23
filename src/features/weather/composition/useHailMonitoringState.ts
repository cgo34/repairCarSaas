import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IHailAlertRepository } from '@/features/weather/application/ports/repositories/IHailAlertRepository';
import { IMonitoredLocationRepository } from '@/features/weather/application/ports/repositories/IMonitoredLocationRepository';
import { createUseHailMonitoringState } from '@/features/weather/presentation/composables/useHailMonitoringState';

export function useHailMonitoringState() {
  return createUseHailMonitoringState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    hailAlertRepository: container.get<IHailAlertRepository>(SYMBOLS.Repositories.HailAlertRepository),
    monitoredLocationRepository: container.get<IMonitoredLocationRepository>(SYMBOLS.Repositories.MonitoredLocationRepository),
  });
}
