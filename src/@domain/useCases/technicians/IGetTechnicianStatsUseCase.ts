import { TechnicianStatsDto } from '@/@application/dtos/TechnicianStatsDto';

export interface IGetTechnicianStatsUseCase {
  execute(technicianId: string): Promise<TechnicianStatsDto>;
}
