// src/@infrastructure/database/repositories/BodyMaterialSupabaseRepository.ts
import { BodyMaterialDto } from '@/features/carRepairSettings/application/dtos/BodyMaterialDto';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { IBodyMaterialRepository } from '@/features/carRepairSettings/application/ports/repositories/IBodyMaterialRepository';
import { BodyMaterialMapper } from '@/features/carRepairSettings/infrastructure/mappers/BodyMaterialMapper';
import { BodyMaterialApiModel } from '@/features/carRepairSettings/infrastructure/api/BodyMaterialApiModel';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';

export class BodyMaterialRepository implements IBodyMaterialRepository {
  constructor(private clientProvider: IClientProvider<SupabaseClient>) {}

  async getAll(): Promise<BodyMaterialDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('body_materials')
      .select('*')
      .returns<BodyMaterialApiModel[]>();

    if (error)
      throw new Error('Error fetching body parts');

    return data.map(BodyMaterialMapper.apiToDto);
  }

  async create(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto> {
    const bodyMaterialApi = BodyMaterialMapper.dtoToApi(bodyMaterial);
    
    const { data, error } = await this.clientProvider.getClient()
      .from('body_materials')
      .insert(bodyMaterialApi)
      .select('*')
      .single<BodyMaterialApiModel>();
    
    if (error)
      throw new Error('Error creating body part');

    return BodyMaterialMapper.apiToDto(data);
  }

  async update(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto> {
    const bodyMaterialApi = BodyMaterialMapper.dtoToApi(bodyMaterial);

    if (!bodyMaterialApi.id)
      throw new Error('Body part id is required');

    const { data, error } = await this.clientProvider.getClient()
      .from('body_materials')
      .update(bodyMaterialApi)
      .eq('id', bodyMaterialApi.id)
      .select('*')
      .single<BodyMaterialApiModel>();

    if (error)
      throw new Error('Error updating body part');
    return BodyMaterialMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('body_materials')
      .delete()
      .eq('id', id);
      
    if (error)
      throw new Error('Error deleting body part');
  }
}