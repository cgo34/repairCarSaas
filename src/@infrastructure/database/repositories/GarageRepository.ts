import { IGarageRepository } from '@/@domain/repositories/IGarageRepository';
import { GarageApiModel } from '@/@infrastructure/database/api/GarageApiModel';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { GarageDto } from '@/@application/dtos/GarageDto';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { GarageMapper } from '@/@infrastructure/mappers/GarageMapper';
import { inject, injectable } from 'inversify';

@injectable()
export class GarageRepository implements IGarageRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getGarages(): Promise<GarageDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('garages')
      .select('*')
      .returns<GarageApiModel[]>();

    if (error) throw new Error('Error fetching garages');

    return data.map(GarageMapper.apiToDto);
  }

  async getByOrganizationId(organizationId: string): Promise<GarageDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('garages')
      .select('*')
      .eq('organization_id', organizationId)
      .returns<GarageApiModel[]>();

    if (error) throw new Error('Error fetching garages');

    return data.map(GarageMapper.apiToDto);
  }

  async create(garage: GarageDto): Promise<GarageDto> {
    const garageApi = GarageMapper.dtoToApi(garage);
    console?.log('Creating garage with API model:', garageApi);

    const { data, error } =
      await this.clientProvider
        .getClient()
        .from('garages')
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
      .from('garages')
      .update(garageApi)
      .eq('id', garageApi.id)
      .select('*')
      .single<GarageApiModel>();

    if (error) throw new Error('Error updating garage');

    return GarageMapper.apiToDto(data);
  }

async archive(id: string): Promise<GarageDto> {
    const { data, error } =
      await this.clientProvider
        .getClient()
        .from('garages')
        .update({
          archived_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single<GarageApiModel>();

    if (error) {
      throw new Error(
        'Error archiving garage'
      );
    }

    return GarageMapper.apiToDto(data);
  }
}
