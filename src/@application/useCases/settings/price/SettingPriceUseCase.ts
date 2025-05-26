import { ISettingPriceBodyPartCoefficientRepository } from '@/@domain/services/settings/price/ISettingPriceBodyPartCoefficientRepository';
import { ISettingPriceGeneralRepository } from '@/@domain/services/settings/price/ISettingPriceGeneralRepository';
import { ISettingPriceImpactCountToUtRepository } from '@/@domain/services/settings/price/ISettingPriceImpactCountToUtRepository';
import { ISettingPriceTechnicityCoefficientRepository } from '@/@domain/services/settings/price/ISettingPriceTechnicityCoefficientRepository';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { SettingPriceDto } from '@/@infrastructure/dtos/settings/price/SettingPriceDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceUseCase implements ISettingPriceUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceGeneralRepository)
    private settingPriceGeneralRepository: ISettingPriceGeneralRepository,
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceGeneralRepository)
    private settingPriceBodyPartCoefficientRepository: ISettingPriceBodyPartCoefficientRepository,
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceBodyPartCoefficient)
    private settingPriceTechnicityCoefficientRepository: ISettingPriceTechnicityCoefficientRepository,
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceImpactCountToUtRepository)
    private settingPriceImpactCountToUtRepository: ISettingPriceImpactCountToUtRepository,
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceDto> {
    const general = await this.settingPriceGeneralRepository.getByUserId(userId);
    const bodyPartCoefficient = await this.settingPriceBodyPartCoefficientRepository.getByUserId(userId);
    const diameterCoefficient = await this.settingPriceTechnicityCoefficientRepository.getByUserId(userId);
    const impactCountToUt = await this.settingPriceImpactCountToUtRepository.getByUserId(userId);

    return {
      general,
      bodyParts: bodyPartCoefficient,
      diameters: diameterCoefficient,
      impactsCount: impactCountToUt,
    };
  }
}
