import { IHailAlertRepository } from '@/features/weather/application/ports/repositories/IHailAlertRepository';
import { HailAlertDto } from '@/features/weather/application/dtos/HailAlertDto';
import { HailAlertApiModel } from '@/features/weather/infrastructure/api/HailAlertApiModel';
import { HailAlertMapper } from '@/features/weather/infrastructure/mappers/HailAlertMapper';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';

export class HailAlertRepository implements IHailAlertRepository {
  constructor(
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
