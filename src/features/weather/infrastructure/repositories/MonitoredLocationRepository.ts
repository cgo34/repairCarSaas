import { IMonitoredLocationRepository } from '@/features/weather/application/ports/repositories/IMonitoredLocationRepository';
import { MonitoredLocationDto } from '@/features/weather/application/dtos/MonitoredLocationDto';
import { MonitoredLocationApiModel } from '@/features/weather/infrastructure/api/MonitoredLocationApiModel';
import { MonitoredLocationMapper } from '@/features/weather/infrastructure/mappers/MonitoredLocationMapper';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';

export class MonitoredLocationRepository implements IMonitoredLocationRepository {
  constructor(
    private clientProvider: IClientProvider<SupabaseClient>
  ) {}

  async getByOrganizationId(organizationId: string): Promise<MonitoredLocationDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('monitored_locations')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: true })
      .returns<MonitoredLocationApiModel[]>();

    if (error) throw new Error('Error fetching monitored locations');

    return data.map(MonitoredLocationMapper.apiToDto);
  }

  async create(location: MonitoredLocationDto): Promise<MonitoredLocationDto> {
    const apiModel = MonitoredLocationMapper.dtoToApi(location);

    const { data, error } = await this.clientProvider.getClient()
      .from('monitored_locations')
      .insert(apiModel)
      .select('*')
      .single<MonitoredLocationApiModel>();

    if (error) throw new Error('Error creating monitored location');

    return MonitoredLocationMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('monitored_locations')
      .delete()
      .eq('id', id);

    if (error) throw new Error('Error deleting monitored location');
  }
}
