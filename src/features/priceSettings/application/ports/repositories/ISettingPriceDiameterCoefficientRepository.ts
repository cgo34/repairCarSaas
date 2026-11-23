import { SettingPriceDiameterCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceDiameterCoefficientDto';

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