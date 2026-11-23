import { HailAlertDto } from '@/features/weather/application/dtos/HailAlertDto';

export interface IHailAlertRepository {
  getAll(): Promise<HailAlertDto[]>;
  getActive(): Promise<HailAlertDto[]>;
}
