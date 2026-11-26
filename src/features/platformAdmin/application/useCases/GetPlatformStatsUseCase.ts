import type { PlatformStatsDto } from '@/features/platformAdmin/application/dtos/PlatformStatsDto';
import type { IPlatformStatsRepository } from '@/features/platformAdmin/application/ports/repositories/IPlatformStatsRepository';

export interface IGetPlatformStatsUseCase {
  execute(): Promise<PlatformStatsDto>;
}

export class GetPlatformStatsUseCase implements IGetPlatformStatsUseCase {
  constructor(private readonly repository: IPlatformStatsRepository) {}

  execute(): Promise<PlatformStatsDto> {
    return this.repository.getStats();
  }
}
