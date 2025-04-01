import { ISettingPriceRepairTypeCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceRepairTypeCoefficientRepository';
import { ISettingPriceBodyMaterialCoefficientService } from '@/@domain/services/settings/price/ISettingPriceBodyMaterialCoefficientService';
import { ISettingPriceBodyPartCoefficientService } from '@/@domain/services/settings/price/ISettingPriceBodyPartCoefficientService';
import { ISettingPriceDiameterCoefficientService } from '@/@domain/services/settings/price/ISettingPriceDiameterCoefficientService';
import { ISettingPriceGeneralService } from '@/@domain/services/settings/price/ISettingPriceGeneralService';
import { ISettingPriceImpactCountToUtService } from '@/@domain/services/settings/price/ISettingPriceImpactCountToUtService';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { SettingPriceDto } from '@/@infrastructure/dtos/settings/price/SettingPriceDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceUseCase implements ISettingPriceUseCase {
  constructor(
    @inject(SYMBOLS.Services.Setting.Price.SettingPriceGeneralService)
    private settingPriceGeneralService: ISettingPriceGeneralService,
    @inject(SYMBOLS.Services.Setting.Price.SettingPriceBodyMaterialCoefficientService)
    private settingPriceBodyMaterialCoefficientService: ISettingPriceBodyMaterialCoefficientService,
    @inject(SYMBOLS.Services.Setting.Price.SettingPriceBodyPartCoefficientService)
    private settingPriceBodyPartCoefficientService: ISettingPriceBodyPartCoefficientService,
    @inject(SYMBOLS.Services.Setting.Price.SettingPriceDiameterCoefficientService)
    private settingPriceDiameterCoefficientService: ISettingPriceDiameterCoefficientService,
    @inject(SYMBOLS.Services.Setting.Price.SettingPriceImpactCountToUtService)
    private settingPriceImpactCountToUtService: ISettingPriceImpactCountToUtService,
    @inject(SYMBOLS.Repositories.Setting.Price.RepairTypeCoefficient)
    private settingPriceRepairTypeCoefficientRepository: ISettingPriceRepairTypeCoefficientRepository
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceDto> {
    const general = await this.settingPriceGeneralService.getByUserId(userId);
    const bodyMaterialCoefficient = await this.settingPriceBodyMaterialCoefficientService.getByUserId(userId);
    const bodyPartCoefficient = await this.settingPriceBodyPartCoefficientService.getByUserId(userId);
    const diameterCoefficient = await this.settingPriceDiameterCoefficientService.getByUserId(userId);
    const impactCountToUt = await this.settingPriceImpactCountToUtService.getByUserId(userId);
    const repairtTypes = await this.settingPriceRepairTypeCoefficientRepository.getByUserId(userId);

    return {
      general,
      bodyMaterials: bodyMaterialCoefficient,
      bodyParts: bodyPartCoefficient,
      diameters: diameterCoefficient,
      impactsCount: impactCountToUt,
      repairTypes: repairtTypes
    };
  }
}
