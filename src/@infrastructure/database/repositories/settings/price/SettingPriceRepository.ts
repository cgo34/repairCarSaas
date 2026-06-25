// src/@infrastructure/database/repositories/settings/price/SettingPriceRepository.ts
import { ISettingPriceBodyPartCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyPartCoefficientRepository';
import { ISettingPriceGeneralRepository } from '@/@domain/repositories/settings/price/ISettingPriceGeneralRepository';
import { ISettingPriceImpactCountToUtRepository } from '@/@domain/repositories/settings/price/ISettingPriceImpactCountToUtRepository';
import { ISettingPriceTechnicityCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceTechnicityCoefficientRepository';
import { ISettingPriceRepository } from '@/@domain/repositories/settings/price/ISettingPriceRepository';
import { SettingPriceDto } from '@/@application/dtos/settings/price/SettingPriceDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { ISettingPriceDiameterCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceDiameterCoefficientRepository';

@injectable()
export class SettingPriceRepository implements ISettingPriceRepository {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceGeneralRepository)
    private settingPriceGeneralRepository: ISettingPriceGeneralRepository,
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceDiameterCoefficientRepository)
    private settingPriceDiameterCoefficientRepository: ISettingPriceDiameterCoefficientRepository,
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceBodyPartCoefficient)
    private settingPriceBodyPartCoefficientRepository: ISettingPriceBodyPartCoefficientRepository,
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceTechnicityCoefficient)
    private settingPriceTechnicityCoefficientRepository: ISettingPriceTechnicityCoefficientRepository,
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceImpactCountToUtRepository)
    private settingPriceImpactCountToUtRepository: ISettingPriceImpactCountToUtRepository,
  ) {}

  async getByOrganizationId(organizationId: string): Promise<SettingPriceDto | null> {
    const general = await this.settingPriceGeneralRepository.getByOrganizationId(organizationId);

    // Si l'utilisateur n'a pas encore configuré ses paramètres, on retourne les paramètres par défaut
    if (!general) {
      return this.getDefault();
    }

    const [bodyParts, technicity, impactsCount] = await Promise.all([
      // this.settingPriceDiameterCoefficientRepository.getByorganizationId(organizationId),
      this.settingPriceBodyPartCoefficientRepository.getByOrganizationId(organizationId),
      this.settingPriceTechnicityCoefficientRepository.getByOrganizationId(organizationId),
      this.settingPriceImpactCountToUtRepository.getByOrganizationId(organizationId),
    ]);

    // Fallback sur les defaults si certains sous-paramètres manquent
    if (!technicity) {
      return this.getDefault();
    }

    return { general, bodyParts: bodyParts ?? [], technicity, impactsCount: impactsCount ?? [] };
  }

  async getDefault(): Promise<SettingPriceDto> {
    const general = await this.settingPriceGeneralRepository.getDefault();
    // const diameters = await this.settingPriceDiameterCoefficientRepository.getDefault();
    const bodyParts = await this.settingPriceBodyPartCoefficientRepository.getDefault();
    const technicity = await this.settingPriceTechnicityCoefficientRepository.getDefault();
    const impactsCount = await this.settingPriceImpactCountToUtRepository.getDefault();

    return { general, /* diameters, */ bodyParts, technicity, impactsCount };
  }

  async createForUser(organizationId: string): Promise<void> {
    // Vérifier si les settings propres à cette org existent déjà (sans tomber sur les defaults)
    const existingGeneral = await this.settingPriceGeneralRepository.getByOrganizationId(organizationId);

    if (existingGeneral !== null) {
      return;
    }

    let defaultSettings: SettingPriceDto;
    try {
      defaultSettings = await this.getDefault();
    } catch (e) {
      console.error('[SettingPriceRepo] Unable to load defaults, skipping settings creation', e);
      return;
    }

    // Créer les settings généraux
    try {
      await this.settingPriceGeneralRepository.create({
        userId: organizationId,
        hourlyRate: defaultSettings.general.hourlyRate,
        unitTime: defaultSettings.general.unitTime,
      });
    } catch (e) {
      console.warn('[SettingPriceRepo] General settings already exist, skipping');
    }

    // Créer les coefficients de technicité
    try {
      await this.settingPriceTechnicityCoefficientRepository.create({
        userId: organizationId,
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
          userId: organizationId,
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
          userId: organizationId,
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
