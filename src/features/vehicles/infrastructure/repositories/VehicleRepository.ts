import { IVehicleRepository } from '@/features/vehicles/application/ports/repositories/IVehicleRepository';
import { VehicleApiModel } from '@/features/vehicles/infrastructure/api/VehicleApiModel';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { VehicleDto } from '@/features/vehicles/application/dtos/VehicleDto';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { VehicleMapper } from '@/features/vehicles/infrastructure/mappers/VehicleMapper';

export class VehicleRepository implements IVehicleRepository {
  constructor(private clientProvider: IClientProvider<SupabaseClient>) {}

  async getByGarageId(garageId: string): Promise<VehicleDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('vehicles')
      .select('*')
      .eq('garage_id', garageId)
      .returns<VehicleApiModel[]>();

    if (error) throw new Error('Error fetching vehicles');
    return data.map(VehicleMapper.apiToDto);
  }

  async getById(id: string): Promise<VehicleDto | null> {
    const { data, error } = await this.clientProvider.getClient()
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single<VehicleApiModel>();

    if (error) throw new Error('Error fetching vehicle');
    return data ? VehicleMapper.apiToDto(data) : null;
  }

  async create(vehicle: VehicleDto): Promise<VehicleDto> {
    const api = VehicleMapper.dtoToApi(vehicle);

    const { data, error } = await this.clientProvider.getClient()
      .from('vehicles')
      .insert(api)
      .select('*')
      .single<VehicleApiModel>();

    if (error) throw new Error('Error creating vehicle');
    return VehicleMapper.apiToDto(data);
  }

  async update(vehicle: VehicleDto): Promise<VehicleDto> {
    const api = VehicleMapper.dtoToApi(vehicle);
    if (!api.id) throw new Error('Vehicle ID is required');

    const { data, error } = await this.clientProvider.getClient()
      .from('vehicles')
      .update(api)
      .eq('id', api.id)
      .select('*')
      .single<VehicleApiModel>();

    if (error) throw new Error('Error updating vehicle');
    return VehicleMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting vehicle');
  }
}
