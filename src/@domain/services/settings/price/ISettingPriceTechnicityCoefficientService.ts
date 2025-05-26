import { SettingPriceTechnicityCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceTechnicityCoefficientDto';

export interface ISettingPriceTechnicityCoefficientService {
  getByUserId(userId: string): Promise<SettingPriceTechnicityCoefficientDto[]>;
  create(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  update(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  delete(id: string): Promise<void>;
}
