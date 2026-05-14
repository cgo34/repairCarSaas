import { OrganizationProfileDto } from '@/@application/dtos/organizations/OrganizationProfileDto';

import { OrganizationProfileViewModel } from '@/@presentation/types/models/organizations/OrganizationProfileViewModel';

export class OrganizationProfileMapper {
  /**
   * ============================================================
   * DTO -> VIEW
   * ============================================================
   */

  static dtoToView(
    dto: OrganizationProfileDto
  ): OrganizationProfileViewModel {
    return {
      id: dto.id,

      organization_id: dto.organization_id,

      company_name: dto.company_name,

      legal_form: dto.legal_form,

      siren: dto.siren,

      siret: dto.siret,

      tva_number: dto.tva_number,

      capital: dto.capital,

      address: dto.address,

      zip_code: dto.zip_code,

      city: dto.city,

      country: dto.country,

      phone: dto.phone,

      email: dto.email,

      website: dto.website,

      iban: dto.iban,

      bic: dto.bic,

      payment_delay: dto.payment_delay,

      late_payment_penalty:
        dto.late_payment_penalty,

      recovery_fee: dto.recovery_fee,
    };
  }

  /**
   * ============================================================
   * VIEW -> DTO
   * ============================================================
   */

  static viewToDto(
    view: OrganizationProfileViewModel
  ): OrganizationProfileDto {
    return {
      id: view.id,

      organization_id: view.organization_id,

      company_name: view.company_name,

      legal_form: view.legal_form,

      siren: view.siren,

      siret: view.siret,

      tva_number: view.tva_number,

      capital: view.capital,

      address: view.address,

      zip_code: view.zip_code,

      city: view.city,

      country: view.country,

      phone: view.phone,

      email: view.email,

      website: view.website,

      iban: view.iban,

      bic: view.bic,

      payment_delay: view.payment_delay,

      late_payment_penalty:
        view.late_payment_penalty,

      recovery_fee: view.recovery_fee,
    };
  }
}