import { DentRepairTypeDto } from "@/@application/dtos/carRepair/DentRepairTypeDto";
import { IDentRepairTypeRepository } from "@/@domain/repositories/carRepair/IDentRepairTypeRepository";
import { IClientProvider } from "@/@infrastructure/interfaces/IClientProvider";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { DentRepairTypeMapper } from "@/@infrastructure/mappers/carRepair/DentRepairTypeMapper";
import { inject, injectable } from "inversify";
import { DentRepairTypeApiModel } from "../../api/carRepair/DentRepairTypeApiModel";
import { SupabaseClient } from '../../clients/SupabaseClient';

@injectable()
export class DentRepairTypeRepository implements IDentRepairTypeRepository {
  constructor(@inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>) {}

  async getAll(): Promise<DentRepairTypeDto[]> {
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'repair_types'>('car_repair', 'repair_types')
      .select('*')
      .returns<DentRepairTypeApiModel[]>();

    if (error)
      throw new Error('Error fetching dent repair types');

    return data.map(DentRepairTypeMapper.apiToDto);
  }

  async create(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto> {
    const dentRepairTypeApi = DentRepairTypeMapper.dtoToApi(dentRepairType);

    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'repair_types'>('car_repair', 'repair_types')
      .insert(dentRepairTypeApi)
      .select('*')
      .single<DentRepairTypeApiModel>();
    console.log('DentRepairTypeRepository.create', data, error);
    
    if (error)
      throw new Error('Error creating dent repair type');

    return DentRepairTypeMapper.apiToDto(data);
  }

  async update(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto> {
    const dentRepairTypeApi = DentRepairTypeMapper.dtoToApi(dentRepairType);

    if (!dentRepairTypeApi.id)
      throw new Error('Dent repair type id is required');
    
    const { data, error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'repair_types'>('car_repair', 'repair_types')
      .update(dentRepairTypeApi)
      .eq('id', dentRepairTypeApi.id)
      .single<DentRepairTypeApiModel>();

    if (error)
      throw new Error('Error updating dent repair type');
    
    return DentRepairTypeMapper.apiToDto(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.clientProvider.getClient()
      .fromSchema<'car_repair', 'repair_types'>('car_repair', 'repair_types')
      .delete()
      .eq('id', id);

    if (error)
      throw new Error('Error deleting dent repair type');
  }
}