import { SettingPriceTechnicityCoefficientDto } from "@/@application/dtos/settings/price/SettingPriceTechnicityCoefficientDto";


export interface ISettingPriceTechnicityCoefficientUseCase {
  getAdmin(): Promise<SettingPriceTechnicityCoefficientDto>;
  getByUserId(userId: string): Promise<SettingPriceTechnicityCoefficientDto>;
  save(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  create(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  update(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  delete(id: string): Promise<void>;
}
