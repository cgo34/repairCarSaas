import { SettingPriceTechnicityCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceTechnicityCoefficientDto';

export interface ISettingPriceTechnicityCoefficientService {
  getByUserId(userId: string): Promise<SettingPriceTechnicityCoefficientDto | null>;
  create(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  update(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  delete(id: string): Promise<void>;
}
