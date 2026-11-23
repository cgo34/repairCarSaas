// src/@infrastructure/database/repositories/settings/price/SettingPriceBodyPartCoefficientRepository.ts
import { ISettingPriceBodyPartCoefficientRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceBodyPartCoefficientRepository';
import { SettingPriceBodyPartCoefficientApiModel } from '@/features/priceSettings/infrastructure/api/SettingPriceBodyPartCoefficientApiModel';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { SettingPriceBodyPartCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceBodyPartCoefficientDto';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { SettingPriceBodyPartCoefficientMapper } from '@/features/priceSettings/infrastructure/mappers/SettingPriceBodyPartCoefficientMapper';

export class SettingPriceBodyPartCoefficientRepository implements ISettingPriceBodyPartCoefficientRepository {
  constructor(private clientProvider: IClientProvider<SupabaseClient>) {}
  
  async getDefault(): Promise<SettingPriceBodyPartCoefficientDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('default_setting_price_body_part_coefficient')
      .select(`*, body_parts(*)`)
      .returns<SettingPriceBodyPartCoefficientApiModel[]>();

    if (error) throw new Error('Error fetching default body part coefficient settings');

    return data.map(SettingPriceBodyPartCoefficientMapper.apiToDto);
  }

  async getByOrganizationId(organizationId: string): Promise<SettingPriceBodyPartCoefficientDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_body_part_coefficient')
      .select('*, body_parts(*)')
      .eq('organization_id', organizationId)
      .returns<SettingPriceBodyPartCoefficientApiModel[]>();

    if (error) throw new Error('Error fetching body part coefficient settings');

    return data.map(SettingPriceBodyPartCoefficientMapper.apiToDto);
  }
    
  private toInsertRow(setting: SettingPriceBodyPartCoefficientDto) {
    const { body_part_id, difficulty_coefficient, organization_id } = SettingPriceBodyPartCoefficientMapper.dtoToApi(setting);
    if (!body_part_id) throw new Error('Body part ID is required');
    return { body_part_id, difficulty_coefficient, organization_id };
  }

  async save(settings: SettingPriceBodyPartCoefficientDto[]): Promise<SettingPriceBodyPartCoefficientDto[]> {
    const settingsApi = settings.map(s => this.toInsertRow(s));
    
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_body_part_coefficient')
      .upsert(settingsApi, { onConflict: 'organization_id, body_part_id' })
      .select('*, body_parts(*)')
      .returns<SettingPriceBodyPartCoefficientApiModel[]>();

    if (error) throw new Error('Error saving general setting');

    return data.map(d => SettingPriceBodyPartCoefficientMapper.apiToDto(d));
  }

  async create(setting: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_body_part_coefficient')
      .insert(this.toInsertRow(setting))
      .select('*, body_parts(*)')
      .single<SettingPriceBodyPartCoefficientApiModel>();

    if (error) {
      console.error('[BodyPartCoefficientRepo] create error:', error);
      throw new Error('Error creating body part coefficient setting');
    }

    return SettingPriceBodyPartCoefficientMapper.apiToDto(data);
  }

  async update(setting: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    const settingApi = SettingPriceBodyPartCoefficientMapper.dtoToApi(setting);

    if (!settingApi.body_part_id) throw new Error('Setting ID is required');

    const { data, error } = await this.clientProvider.getClient()
      .from('setting_price_body_part_coefficient')
      .update({
        difficulty_coefficient: settingApi.difficulty_coefficient,
        body_part_id: settingApi.body_part_id,
        organization_id: settingApi.organization_id
      })
      .eq('body_part_id', settingApi.body_part_id)
      .eq('organization_id', settingApi.organization_id)
      .select('*, body_parts(*)')
      .single<SettingPriceBodyPartCoefficientApiModel>();

    if (error) throw new Error('Error updating body part coefficient setting');

    return SettingPriceBodyPartCoefficientMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('setting_price_body_part_coefficient')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting body part coefficient setting');
  }
}
