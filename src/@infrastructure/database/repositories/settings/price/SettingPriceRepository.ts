// src/@infrastructure/database/repositories/settings/price/SettingPriceRepository.ts
import { ISettingPriceBodyPartCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyPartCoefficientRepository';
import { ISettingPriceGeneralRepository } from '@/@domain/repositories/settings/price/ISettingPriceGeneralRepository';
import { ISettingPriceImpactCountToUtRepository } from '@/@domain/repositories/settings/price/ISettingPriceImpactCountToUtRepository';
import { ISettingPriceTechnicityCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceTechnicityCoefficientRepository';
import { ISettingPriceRepository } from '@/@domain/repositories/settings/price/ISettingPriceRepository';
import { SettingPriceDto } from '@/@infrastructure/dtos/settings/price/SettingPriceDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceRepository implements ISettingPriceRepository {
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
    const general = await this.settingPriceGeneralRepository.getByUserId(userId);
    const bodyParts = await this.settingPriceBodyPartCoefficientRepository.getByUserId(userId);
    const technicity = await this.settingPriceTechnicityCoefficientRepository.getByUserId(userId);
    const impactsCount = await this.settingPriceImpactCountToUtRepository.getByUserId(userId);

    return { general, bodyParts, technicity, impactsCount };
  }

  async getDefault(): Promise<SettingPriceDto> {
    const general = await this.settingPriceGeneralRepository.getAdmin();
    const bodyParts = await this.settingPriceBodyPartCoefficientRepository.getAdmin();
    const technicity = await this.settingPriceTechnicityCoefficientRepository.getAdmin();
    const impactsCount = await this.settingPriceImpactCountToUtRepository.getAdmin();

    return { general, bodyParts, technicity, impactsCount };
  }

  async createForUser(userId: string): Promise<void> {
    // Vérifier si les settings existent déjà pour éviter les doublons
    const existingSettings = await this.settingPriceGeneralRepository.getByUserId(userId);
    if (existingSettings) {
      console.log('[SettingPriceRepo] Settings already exist for user:', userId);
      return;
    }

    const defaultSettings = await this.getDefault();

    // Créer les settings généraux
    try {
      await this.settingPriceGeneralRepository.create({
        userId,
        hourlyRate: defaultSettings.general.hourlyRate,
        unitTime: defaultSettings.general.unitTime,
      });
    } catch (e) {
      console.warn('[SettingPriceRepo] General settings already exist, skipping');
    }

    // Créer les coefficients de technicité
    try {
      await this.settingPriceTechnicityCoefficientRepository.create({
        userId,
        dapCoefficient: defaultSettings.technicity.dapCoefficient,
        dspCoefficient: defaultSettings.technicity.dspCoefficient,
        aluminiumCoefficient: defaultSettings.technicity.aluminiumCoefficient,
        diameter25Coefficient: defaultSettings.technicity.diameter25Coefficient,
        diameter35Coefficient: defaultSettings.technicity.diameter35Coefficient,
      });
    } catch (e) {
      console.warn('[SettingPriceRepo] Technicity settings already exist, skipping');
    }

    // Créer les coefficients par partie de carrosserie
    for (const bodyPart of defaultSettings.bodyParts) {
      try {
        await this.settingPriceBodyPartCoefficientRepository.create({
          userId,
          bodyPartId: bodyPart.bodyPartId,
          coefficient: bodyPart.coefficient,
        });
      } catch (e) {
        // Ignorer les doublons
      }
    }

    // Créer les correspondances nombre d'impacts -> UT
    for (const impactCount of defaultSettings.impactsCount) {
      try {
        await this.settingPriceImpactCountToUtRepository.create({
          userId,
          impactCountMin: impactCount.impactCountMin,
          impactCountMax: impactCount.impactCountMax,
          unitTime: impactCount.unitTime,
        });
      } catch (e) {
        // Ignorer les doublons
      }
    }
  }
}
