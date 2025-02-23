import { GarageDto } from '@/@application/dtos/GarageDto';
import { IGarageRepository } from '@/@domain/repositories/IGarageRepository';
import { GarageApiModel } from '@/@infrastructure/database/api/GarageApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { GarageMapper } from '@/@infrastructure/mappers/GarageMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class GarageRepository implements IGarageRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getByUserId(userId: string): Promise<GarageDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'garages'>('car_repair', 'garages')
      .select('*')
      .eq('user_id', userId)
      .returns<GarageApiModel[]>();

    if (error) throw new Error('Error fetching garages');

    return data.map(GarageMapper.apiToDto);
  }

  async getById(id: string): Promise<GarageDto | null> {
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'garages'>('car_repair', 'garages')
      .select('*')
      .eq('id', id)
      .single<GarageApiModel>();

    if (error) throw new Error('Error fetching garage');

    return data ? GarageMapper.apiToDto(data) : null;
  }

  async create(garage: GarageDto): Promise<GarageDto> {
    const garageApi = GarageMapper.dtoToApi(garage);

    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'garages'>('car_repair', 'garages')
      .insert(garageApi)
      .select('*')
      .single<GarageApiModel>();

    if (error) throw new Error('Error creating garage');

    return GarageMapper.apiToDto(data);
  }

  async update(garage: GarageDto): Promise<GarageDto> {
    const garageApi = GarageMapper.dtoToApi(garage);

    if (!garageApi.id) throw new Error('Garage ID is required');

    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'garages'>('car_repair', 'garages')
      .update(garageApi)
      .eq('id', garageApi.id)
      .single<GarageApiModel>();

    if (error) throw new Error('Error updating garage');

    return GarageMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'garages'>('car_repair', 'garages')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting garage');
  }
}
