// src/@infrastructure/database/repositories/BodyMaterialSupabaseRepository.ts
import { BodyMaterialDto } from '@/@application/dtos/carRepair/BodyMaterialDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { IBodyMaterialRepository } from '@domain/repositories/carRepair/IBodyMaterialRepository';
import { BodyMaterialMapper } from '@infrastructure/mappers/carRepair/BodyMaterialMapper';
import { inject, injectable } from 'inversify';
import { BodyMaterialApiModel } from '../../api/carRepair/BodyMaterialApiModel';
import { SupabaseClient } from '../../clients/SupabaseClient';

@injectable()
export class BodyMaterialRepository implements IBodyMaterialRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getAll(): Promise<BodyMaterialDto[]> {
    console.log('BodyMaterialRepository.getAll');
    
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'body_materials'>('car_repair', 'body_materials')
      .select('*')
      .returns<BodyMaterialApiModel[]>();

    if (error)
      throw new Error('Error fetching body parts');

    return data.map(BodyMaterialMapper.apiToDto);
  }

  async create(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto> {
    const bodyMaterialApi = BodyMaterialMapper.dtoToApi(bodyMaterial);
    
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'body_materials'>('car_repair', 'body_materials')
      .insert(bodyMaterialApi)
      .select('*')
      .single<BodyMaterialApiModel>();
    console.log('BodyMaterialRepository.create', data, error);
    
    if (error)
      throw new Error('Error creating body part');

    return BodyMaterialMapper.apiToDto(data);
  }

  async update(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto> {
    const bodyMaterialApi = BodyMaterialMapper.dtoToApi(bodyMaterial);

    if (!bodyMaterialApi.id)
      throw new Error('Body part id is required');

    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'body_materials'>('car_repair', 'body_materials')
      .update(bodyMaterialApi)
      .eq('id', bodyMaterialApi.id)
      .single<BodyMaterialApiModel>();

    if (error)
      throw new Error('Error updating body part');
    return BodyMaterialMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'body_materials'>('car_repair', 'body_materials')
      .delete()
      .eq('id', id);
      
    if (error)
      throw new Error('Error deleting body part');
  }
}