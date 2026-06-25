import { IMonitoredLocationRepository } from '@/@domain/repositories/hail/IMonitoredLocationRepository';
import { MonitoredLocationDto } from '@/@application/dtos/hail/MonitoredLocationDto';
import { MonitoredLocationApiModel } from '@/@infrastructure/database/api/hail/MonitoredLocationApiModel';
import { MonitoredLocationMapper } from '@/@infrastructure/mappers/hail/MonitoredLocationMapper';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class MonitoredLocationRepository implements IMonitoredLocationRepository {
  constructor(
    @inject(SYMBOLS.Providers.ClientProvider)
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
