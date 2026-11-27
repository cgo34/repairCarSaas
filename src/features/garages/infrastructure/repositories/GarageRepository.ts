import { IGarageRepository } from '@/features/garages/application/ports/repositories/IGarageRepository';
import { GarageApiModel } from '@/features/garages/infrastructure/api/GarageApiModel';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { GarageDto } from '@/features/garages/application/dtos/GarageDto';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { GarageMapper } from '@/features/garages/infrastructure/mappers/GarageMapper';
import { PlanLimitError } from '@/features/featureAccess/domain/errors/PlanLimitError';

export class GarageRepository implements IGarageRepository {
  constructor(private clientProvider: IClientProvider<SupabaseClient>) {}

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
      .is('archived_at', null)
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

    if (error) throw PlanLimitError.from(error) ?? new Error('Error creating garage');

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
