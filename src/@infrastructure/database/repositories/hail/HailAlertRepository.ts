import { IHailAlertRepository } from '@/@domain/repositories/hail/IHailAlertRepository';
import { HailAlertDto } from '@/@application/dtos/hail/HailAlertDto';
import { HailAlertApiModel } from '@/@infrastructure/database/api/hail/HailAlertApiModel';
import { HailAlertMapper } from '@/@infrastructure/mappers/hail/HailAlertMapper';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class HailAlertRepository implements IHailAlertRepository {
  constructor(
    @inject(SYMBOLS.Providers.ClientProvider)
    private clientProvider: IClientProvider<SupabaseClient>
  ) {}

  async getAll(): Promise<HailAlertDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('hail_alerts')
      .select('*, hail_departments(*)')
      .order('risk_level', { ascending: false })
      .returns<HailAlertApiModel[]>();

    if (error) throw new Error('Error fetching hail alerts');

    return data.map(HailAlertMapper.apiToDto);
  }

  async getActive(): Promise<HailAlertDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('hail_alerts')
      .select('*, hail_departments(*)')
      .in('risk_level', ['active', 'high', 'moderate'])
      .order('risk_level', { ascending: false })
      .returns<HailAlertApiModel[]>();

    if (error) throw new Error('Error fetching active hail alerts');

    return data.map(HailAlertMapper.apiToDto);
  }
}
