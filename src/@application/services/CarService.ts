import { Garage } from '@/@domain/entities/Garage';

export class GarageService {
  async getAllGarages(): Promise<Garage[]> {
    const { data, error } = await supabase.from('garages').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async createGarage(garage: Garage) {
    const { error } = await supabase.from('garages').insert(garage);
    if (error) throw new Error(error.message);
  }
}