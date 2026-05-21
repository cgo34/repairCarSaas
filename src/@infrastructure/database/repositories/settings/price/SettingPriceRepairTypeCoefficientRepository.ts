// src/@infrastructure/database/repositories/settings/price/SettingPriceRepairTypeCoefficientRepository.ts
import { ISettingPriceRepairTypeCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceRepairTypeCoefficientRepository';
import { SettingPriceRepairTypeCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceRepairTypeCoefficientApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { SettingPriceRepairTypeCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceRepairTypeCoefficientDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { SettingPriceRepairTypeCoefficientMapper } from '@/@infrastructure/mappers/settings/price/SettingPriceRepairTypeCoefficientMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceRepairTypeCoefficientRepository implements ISettingPriceRepairTypeCoefficientRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getByorganizationId(organizationId: string): Promise<SettingPriceRepairTypeCoefficientDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_repair_type_coefficient')
      .select('*, repair_types(*)')
      .eq('organization_id', organizationId)
      .returns<SettingPriceRepairTypeCoefficientApiModel[]>();

    if (error) throw new Error('Error fetching body material coefficient settings');

    return data.map(SettingPriceRepairTypeCoefficientMapper.apiToDto);
  }

  async create(setting: SettingPriceRepairTypeCoefficientDto): Promise<SettingPriceRepairTypeCoefficientDto> {
    const settingApi = SettingPriceRepairTypeCoefficientMapper.dtoToApi(setting);

    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_repair_type_coefficient')
      .insert({
        repair_type_coefficient: settingApi.repair_type_coefficient,
        repair_type_id: settingApi.repair_types?.id,
        organization_id: settingApi.organization_id
      })
      .select('*, repair_types(*)')
      .single<SettingPriceRepairTypeCoefficientApiModel>();

    if (error) throw new Error('Error creating body material coefficient setting');

    return SettingPriceRepairTypeCoefficientMapper.apiToDto(data);
  }

  async update(setting: SettingPriceRepairTypeCoefficientDto): Promise<SettingPriceRepairTypeCoefficientDto> {
    const settingApi = SettingPriceRepairTypeCoefficientMapper.dtoToApi(setting);

    if (!settingApi.repair_type_id) throw new Error('Setting ID is required');

    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_repair_type_coefficient')
      .update({
        repair_type_coefficient: settingApi.repair_type_coefficient,
        repair_type_id: settingApi.repair_types?.id,
        user_id: settingApi.user_id
      })
      .eq('repair_type_id', settingApi.repair_type_id)
      .eq('user_id', settingApi.user_id)
      .select('*, repair_types(*)')
      .single<SettingPriceRepairTypeCoefficientApiModel>();

    if (error) throw new Error('Error updating body material coefficient setting');

    return SettingPriceRepairTypeCoefficientMapper.apiToDto(data);
  }

  async delete(bodyMaterialId: string, userId: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('setting_price_repair_type_coefficient')
      .delete()
      .eq('id', bodyMaterialId)
      .eq('user_id', userId);

    if (error) throw new Error('Error deleting body material coefficient setting');
  }
}
