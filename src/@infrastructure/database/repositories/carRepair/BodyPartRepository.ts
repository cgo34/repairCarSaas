// src/@infrastructure/database/repositories/BodyPartSupabaseRepository.ts
import { BodyPartDto } from '@/@application/dtos/carRepair/BodyPartDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { BodyPartMapper } from '@/@infrastructure/mappers/carRepair/BodyPartMapper';
import { IBodyPartRepository } from '@domain/repositories/carRepair/IBodyPartRepository';
import { inject, injectable } from 'inversify';
import { BodyPartApiModel } from '../../api/carRepair/BodyPartApiModel';
import { SupabaseClient } from '../../clients/SupabaseClient';

@injectable()
export class BodyPartRepository implements IBodyPartRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getAll(): Promise<BodyPartDto[]> {
    
    const { data, error } = await this.clientProvider.getClient()
      .from('body_parts')
      .select('*')
      .returns<BodyPartApiModel[]>();

    if (error)
      throw new Error('Error fetching body parts');

    return data.map(BodyPartMapper.apiToDto);
  }

  async create(bodyPart: BodyPartDto): Promise<BodyPartDto> {
    const bodyPartApi = BodyPartMapper.dtoToApi(bodyPart);
    
    const { data, error } = await this.clientProvider.getClient()
      .from('body_parts')
      .insert(bodyPartApi)
      .select('*')
      .single<BodyPartApiModel>();
    
    if (error)
      throw new Error('Error creating body part');

    return BodyPartMapper.apiToDto(data);
  }

  async update(bodyPart: BodyPartDto): Promise<BodyPartDto> {
    const bodyPartApi = BodyPartMapper.dtoToApi(bodyPart);

    if (!bodyPartApi.id)
      throw new Error('Body part id is required');

    const { data, error } = await this.clientProvider.getClient()
      .from('body_parts')
      .update(bodyPartApi)
      .eq('id', bodyPartApi.id)
      .select('*')
      .single<BodyPartApiModel>();

    if (error)
      throw new Error('Error updating body part');

    return BodyPartMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('body_parts')
      .delete()
      .eq('id', id);
      
    if (error)
      throw new Error('Error deleting body part');
  }
}