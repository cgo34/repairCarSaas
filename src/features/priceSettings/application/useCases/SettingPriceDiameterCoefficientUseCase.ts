
import { SettingPriceDiameterCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceDiameterCoefficientDto';

import { ISettingPriceDiameterCoefficientRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceDiameterCoefficientRepository';

export interface ISettingPriceDiameterCoefficientUseCase {
  /**
   * ============================================================
   * GET DEFAULT
   * ============================================================
   */

  getDefault():
    Promise<SettingPriceDiameterCoefficientDto>;

  /**
   * ============================================================
   * GET BY ORGANIZATION ID
   * ============================================================
   */

  getByOrganizationId(
    organizationId: string
  ): Promise<SettingPriceDiameterCoefficientDto | null>;

  /**
   * ============================================================
   * SAVE
   * ============================================================
   */

  save(
    setting: SettingPriceDiameterCoefficientDto
  ): Promise<SettingPriceDiameterCoefficientDto>;

  /**
   * ============================================================
   * CREATE
   * ============================================================
   */

  create(
    setting: SettingPriceDiameterCoefficientDto
  ): Promise<SettingPriceDiameterCoefficientDto>;

  /**
   * ============================================================
   * UPDATE
   * ============================================================
   */

  update(
    setting: SettingPriceDiameterCoefficientDto
  ): Promise<SettingPriceDiameterCoefficientDto>;

  /**
   * ============================================================
   * DELETE
   * ============================================================
   */

  delete(id: string): Promise<void>;
}

export class SettingPriceDiameterCoefficientUseCase
implements ISettingPriceDiameterCoefficientUseCase
{
  constructor(
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
