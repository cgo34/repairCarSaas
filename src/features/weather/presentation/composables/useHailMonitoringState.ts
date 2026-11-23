import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { HailAlertDto } from '@/features/weather/application/dtos/HailAlertDto';
import { MonitoredLocationDto } from '@/features/weather/application/dtos/MonitoredLocationDto';
import { IHailAlertRepository } from '@/features/weather/application/ports/repositories/IHailAlertRepository';
import { IMonitoredLocationRepository } from '@/features/weather/application/ports/repositories/IMonitoredLocationRepository';
import { computed, ref } from 'vue';
import { IUseHailMonitoringState } from '@/features/weather/presentation/types/IUseHailMonitoringState';

// ── Singleton module-level state (partagé entre tous les composants) ────────
const _alerts = ref<HailAlertDto[]>([]);
const _monitoredLocations = ref<MonitoredLocationDto[]>([]);
const _loading = ref(false);

export const hailActiveCount = computed(() =>
  _alerts.value.filter(a => a.riskLevel !== 'none').length
);

// ────────────────────────────────────────────────────────────────────────────

export interface UseHailMonitoringStateDependencies {
  authState: IAuthState;
  hailAlertRepository: IHailAlertRepository;
  monitoredLocationRepository: IMonitoredLocationRepository;
}

export function createUseHailMonitoringState(deps: UseHailMonitoringStateDependencies): IUseHailMonitoringState {
  const { authState, hailAlertRepository, monitoredLocationRepository } = deps;

  const activeAlerts = computed(() =>
    _alerts.value.filter(a => a.riskLevel !== 'none')
      .sort((a, b) => {
        const order = { active: 0, high: 1, moderate: 2, none: 3 };
        return order[a.riskLevel] - order[b.riskLevel];
      })
  );

  const hasActiveAlerts = computed(() => activeAlerts.value.length > 0);

  async function fetchAlerts(): Promise<void> {
    _loading.value = true;
    try {
      _alerts.value = await hailAlertRepository.getAll();
    } catch (e) {
      console.error('[HailMonitoring] fetchAlerts error:', e);
    } finally {
      _loading.value = false;
    }
  }

  async function fetchMonitoredLocations(): Promise<void> {
    const orgId = authState.userContext.value?.organization.id;
    if (!orgId) return;
    try {
      _monitoredLocations.value = await monitoredLocationRepository.getByOrganizationId(orgId);
    } catch (e) {
      console.error('[HailMonitoring] fetchMonitoredLocations error:', e);
    }
  }

  async function addLocation(location: Omit<MonitoredLocationDto, 'id' | 'createdAt'>): Promise<void> {
    const created = await monitoredLocationRepository.create(location);
    _monitoredLocations.value.push(created);
  }

  async function removeLocation(id: string): Promise<void> {
    await monitoredLocationRepository.delete(id);
    _monitoredLocations.value = _monitoredLocations.value.filter(l => l.id !== id);
  }

  return {
    alerts: _alerts,
    activeAlerts,
    monitoredLocations: _monitoredLocations,
    loading: _loading,
    hasActiveAlerts,
    fetchAlerts,
    fetchMonitoredLocations,
    addLocation,
    removeLocation,
  };
}
