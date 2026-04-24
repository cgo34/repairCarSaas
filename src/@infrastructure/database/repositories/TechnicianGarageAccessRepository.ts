import { GarageDto } from '@/@application/dtos/GarageDto';
import { ITechnicianGarageAccessRepository } from '@/@domain/repositories/ITechnicianGarageAccessRepository';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { GarageMapper } from '@/@infrastructure/mappers/GarageMapper';
import { inject, injectable } from 'inversify';
import { SupabaseClient } from '../clients/SupabaseClient';
import { GarageApiModel } from '../api/GarageApiModel';

@injectable()
export class TechnicianGarageAccessRepository implements ITechnicianGarageAccessRepository {
  constructor(
    @inject(SYMBOLS.Providers.ClientProvider)
    private readonly clientProvider: IClientProvider<SupabaseClient>
  ) {}

  async getGaragesByTechnicianId(technicianId: string): Promise<GarageDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .from('technician_garage_access')
      .select('garage:garages(*)')
      .eq('user_id', technicianId)
      .returns<{ garage: GarageApiModel }[]>();

    if (error) throw new Error(`Error fetching garages for technician: ${error.message}`);

    return (data ?? [])
      .map(row => row.garage)
      .filter(Boolean)
      .map(GarageMapper.apiToDto);
  }

  async assignGarage(technicianId: string, garageId: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('technician_garage_access')
      .upsert({ user_id: technicianId, garage_id: garageId }, { onConflict: 'user_id,garage_id' });

    if (error) throw new Error(`Error assigning garage to technician: ${error.message}`);
  }

  async removeGarage(technicianId: string, garageId: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .from('technician_garage_access')
      .delete()
      .eq('user_id', technicianId)
      .eq('garage_id', garageId);

    if (error) throw new Error(`Error removing garage from technician: ${error.message}`);
  }
}
