// src/@infrastructure/database/repositories/BodyPartSupabaseRepository.ts
import { IClientProvider } from '@/@domain/providers/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { BodyPart } from '@domain/entities/carRepair/BodyPart';
import { IBodyPartRepository } from '@domain/repositories/carRepair/IBodyPartRepository';
import { BodyPartDto } from '@infrastructure/database/dtos/carRepair/BodyPartDto';
import { BodyPartMapper } from '@infrastructure/mappers/carRepair/BodyPartMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class BodyPartRepository implements IBodyPartRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider) {}

  async getAll(): Promise<BodyPart[]> {
    const { data, error } = await this.clientProvider.getClient().fromSchema<BodyPartDto>('car_repair', 'body_parts').select('*');

    if (error) throw new Error('Error fetching body parts');
    return data.map(BodyPartMapper.toDomain);
  }

  async getById(id: number): Promise<BodyPart | null> {
    const { data, error } = await this.clientProvider.getClient().from<BodyPartDto>('car_repair.body_parts').select('*').eq('id', id).single();
    if (error) throw new Error('Error fetching body part');
    return data ? BodyPartMapper.toDomain(data) : null;
  }

  async create(bodyPart: BodyPart): Promise<BodyPart> {
    console.log('BodyPartRepository.create', bodyPart);
    
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema('car_repair', 'body_parts')
      .insert(BodyPartMapper.toDto(bodyPart))
      .select('*')  // <--- Force Supabase à retourner tous les champs
      .single();
    console.log('BodyPartRepository.create', data, error);
    
    if (error) throw new Error('Error creating body part');
    return BodyPartMapper.toDomain(data);
  }

  async update(bodyPart: BodyPart): Promise<BodyPart> {
    const { data, error } = await this.clientProvider.getClient().from<BodyPartDto>('car_repair.body_parts').update(BodyPartMapper.toDto(bodyPart)).eq('id', bodyPart.id).single();
    if (error) throw new Error('Error updating body part');
    return BodyPartMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient().fromSchema<BodyPartDto>('car_repair', 'body_parts').delete().eq('id', id);
    if (error) throw new Error('Error deleting body part');
  }
}