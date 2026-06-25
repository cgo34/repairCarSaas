import { HailAlertDto } from '@/@application/dtos/hail/HailAlertDto';

export interface IHailAlertRepository {
  getAll(): Promise<HailAlertDto[]>;
  getActive(): Promise<HailAlertDto[]>;
}
