import { SettingPriceDiameterCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceDiameterCoefficientDto';

export interface ISettingPriceDiameterCoefficientRepository {
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