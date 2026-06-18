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

  private async getOrgMemberId(userId: string): Promise<string | null> {
    const { data } = await this.clientProvider.getClient()
      .from('organization_members')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle<{ id: string }>();
    return data?.id ?? null;
  }

  async getGaragesByTechnicianId(technicianId: string): Promise<GarageDto[]> {
    const memberId = await this.getOrgMemberId(technicianId);
    if (!memberId) return [];

    const { data, error } = await this.clientProvider.getClient()
      .from('garage_members')
      .select('garage:garages(*)')
      .eq('organization_member_id', memberId)
      .returns<{ garage: GarageApiModel }[]>();

    if (error) throw new Error(`Error fetching garages for technician: ${error.message}`);

    return (data ?? [])
      .map(row => row.garage)
      .filter((g): g is GarageApiModel => !!g && g.archived_at == null)
      .map(GarageMapper.apiToDto);
  }

  async assignGarage(technicianId: string, garageId: string): Promise<void> {
    const memberId = await this.getOrgMemberId(technicianId);
    if (!memberId) throw new Error('Organization member not found for user');

    const { data: existing } = await this.clientProvider.getClient()
      .from('garage_members')
      .select('id')
      .eq('organization_member_id', memberId)
      .eq('garage_id', garageId)
      .maybeSingle<{ id: string }>();

    if (existing) return;

    const { error } = await this.clientProvider.getClient()
      .from('garage_members')
      .insert({ organization_member_id: memberId, garage_id: garageId });

    if (error) throw new Error(`Error assigning garage to technician: ${error.message}`);
  }

  async removeGarage(technicianId: string, garageId: string): Promise<void> {
    const memberId = await this.getOrgMemberId(technicianId);
    if (!memberId) return;

    const { error } = await this.clientProvider.getClient()
      .from('garage_members')
      .delete()
      .eq('organization_member_id', memberId)
      .eq('garage_id', garageId);

    if (error) throw new Error(`Error removing garage from technician: ${error.message}`);
  }
}
