import { inject, injectable } from 'inversify';

import { SettingPriceDiameterCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceDiameterCoefficientDto';

import { ISettingPriceDiameterCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceDiameterCoefficientRepository';

import { ISettingPriceDiameterCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceDiameterCoefficientUseCase';

import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

@injectable()
export class SettingPriceDiameterCoefficientUseCase
implements ISettingPriceDiameterCoefficientUseCase
{
  constructor(
    @inject(
      SYMBOLS.Repositories.Setting.Price.SettingPriceDiameterCoefficientRepository
    )
    private repository:
      ISettingPriceDiameterCoefficientRepository
  ) {}

  /**
   * ============================================================
   * GET DEFAULT
   * ============================================================
   */

  async getDefault():
    Promise<SettingPriceDiameterCoefficientDto>
  {
    return this.repository.getDefault();
  }

  /**
   * ============================================================
   * GET BY ORGANIZATION ID
   * ============================================================
   */

  async getByOrganizationId(
    organizationId: string
  ): Promise<SettingPriceDiameterCoefficientDto | null>
  {
    return this.repository.getByOrganizationId(
      organizationId
    );
  }

  /**
   * ============================================================
   * SAVE
   * ============================================================
   */

  async save(
    setting: SettingPriceDiameterCoefficientDto
  ): Promise<SettingPriceDiameterCoefficientDto>
  {
    return this.repository.save(setting);
  }

  /**
   * ============================================================
   * CREATE
   * ============================================================
   */

  async create(
    setting: SettingPriceDiameterCoefficientDto
  ): Promise<SettingPriceDiameterCoefficientDto>
  {
    return this.repository.create(setting);
  }

  /**
   * ============================================================
   * UPDATE
   * ============================================================
   */

  async update(
    setting: SettingPriceDiameterCoefficientDto
  ): Promise<SettingPriceDiameterCoefficientDto>
  {
    return this.repository.update(setting);
  }

  /**
   * ============================================================
   * DELETE
   * ============================================================
   */

  async delete(id: string): Promise<void>
  {
    return this.repository.delete(id);
  }
}