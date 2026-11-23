import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { IHailAlertRepository } from '@/features/weather/application/ports/repositories/IHailAlertRepository';
import { HailAlertRepository } from '@/features/weather/infrastructure/repositories/HailAlertRepository';
import { IMonitoredLocationRepository } from '@/features/weather/application/ports/repositories/IMonitoredLocationRepository';
import { MonitoredLocationRepository } from '@/features/weather/infrastructure/repositories/MonitoredLocationRepository';
import { useHailMonitoringState } from '@/features/weather/composition/useHailMonitoringState';
import { IUseHailMonitoringState } from '@/features/weather/presentation/types/IUseHailMonitoringState';

export function registerWeatherBindings(container: Container): void {
  container.bind<IHailAlertRepository>(SYMBOLS.Repositories.HailAlertRepository).toDynamicValue(ctx => new HailAlertRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IMonitoredLocationRepository>(SYMBOLS.Repositories.MonitoredLocationRepository).toDynamicValue(ctx => new MonitoredLocationRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IUseHailMonitoringState>(SYMBOLS.States.HailMonitoringState).toDynamicValue(() => {
    return useHailMonitoringState();
  });
}
