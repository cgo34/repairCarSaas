import type { PlatformStatsDto } from '@/features/platformAdmin/application/dtos/PlatformStatsDto';

export interface IPlatformStatsRepository {
  getStats(): Promise<PlatformStatsDto>;
}
