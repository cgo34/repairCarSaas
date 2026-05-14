import { GarageForm } from '@/@presentation/types/forms/GarageForm';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';

export class GarageFormFactory {
  /**
   * ============================================================
   * EMPTY
   * ============================================================
   */

  static createEmpty(): GarageForm {
    return {
      organization_id: '',

      name: '',
      code: '',

      address: '',
      zip_code: '',
      city: '',

      phone: '',
      email: '',
    };
  }

  /**
   * ============================================================
   * FROM GARAGE
   * ============================================================
   */

  static createFromGarage(
    garage: GarageViewModel
  ): GarageForm {
    return {
      id: garage.id,

      organization_id: garage.organization_id,

      name: garage.name,
      code: garage.code,

      address: garage.address,
      zip_code: garage.zip_code,
      city: garage.city,

      phone: garage.phone,
      email: garage.email,
    };
  }
}