
import { ISettingPriceBodyPartCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyPartCoefficientRepository';
import { ISettingPriceGeneralRepository } from '@/@domain/repositories/settings/price/ISettingPriceGeneralRepository';
import { ISettingPriceImpactCountToUtRepository } from '@/@domain/repositories/settings/price/ISettingPriceImpactCountToUtRepository';
import { ISettingPriceTechnicityCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceTechnicityCoefficientRepository';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { SettingPriceDto } from '@/@infrastructure/dtos/settings/price/SettingPriceDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceUseCase implements ISettingPriceUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceGeneralRepository)
    private settingPriceGeneralRepository: ISettingPriceGeneralRepository,
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceBodyPartCoefficient)
    private settingPriceBodyPartCoefficientRepository: ISettingPriceBodyPartCoefficientRepository,
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceTechnicityCoefficient)
    private settingPriceTechnicityCoefficientRepository: ISettingPriceTechnicityCoefficientRepository,
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceImpactCountToUtRepository)
    private settingPriceImpactCountToUtRepository: ISettingPriceImpactCountToUtRepository,
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceDto> {
    console.log('get use price  general param use case', userId)
    const general = await this.settingPriceGeneralRepository.getByUserId(userId);
    const bodyPartCoefficient = await this.settingPriceBodyPartCoefficientRepository.getByUserId(userId);
    const technicityCoefficient = await this.settingPriceTechnicityCoefficientRepository.getByUserId(userId);
    const impactCountToUt = await this.settingPriceImpactCountToUtRepository.getByUserId(userId);
    
    const priceParam = {
      general: general,
      bodyParts: bodyPartCoefficient,
      technicity: technicityCoefficient,
      impactsCount: impactCountToUt,
    };
    console.log(priceParam);

    return priceParam
  }
}
