import { OrganizationProfileDto } from '@/@application/dtos/organizations/OrganizationProfileDto';

import { OrganizationProfileApiModel } from '@/@infrastructure/database/api/OrganizationProfileApiModel';

export class OrganizationProfileMapper {
  /**
   * ============================================================
   * API -> DTO
   * ============================================================
   */

  static apiToDto(
    api: OrganizationProfileApiModel
  ): OrganizationProfileDto {
    return {
      id: api.id,

      organization_id:
        api.organization_id,

      company_name:
        api.company_name,

      legal_form:
        api.legal_form,

      siren:
        api.siren,

      siret:
        api.siret,

      tva_number:
        api.tva_number,

      capital:
        api.capital,

      address:
        api.address,

      zip_code:
        api.zip_code,

      city:
        api.city,

      country:
        api.country,

      phone:
        api.phone,

      email:
        api.email,

      website:
        api.website,

      iban:
        api.iban,

      bic:
        api.bic,

      payment_delay:
        api.payment_delay,

      late_payment_penalty:
        api.late_payment_penalty,

      recovery_fee:
        api.recovery_fee,

      created_at:
        api.created_at,

      updated_at:
        api.updated_at,
    };
  }

  /**
   * ============================================================
   * DTO -> API
   * ============================================================
   */

  static dtoToApi(
    dto: OrganizationProfileDto
  ): OrganizationProfileApiModel {
    return {
      id: dto.id,

      organization_id:
        dto.organization_id,

      company_name:
        dto.company_name,

      legal_form:
        dto.legal_form,

      siren:
        dto.siren,

      siret:
        dto.siret,

      tva_number:
        dto.tva_number,

      capital:
        dto.capital,

      address:
        dto.address,

      zip_code:
        dto.zip_code,

      city:
        dto.city,

      country:
        dto.country,

      phone:
        dto.phone,

      email:
        dto.email,

      website:
        dto.website,

      iban:
        dto.iban,

      bic:
        dto.bic,

      payment_delay:
        dto.payment_delay,

      late_payment_penalty:
        dto.late_payment_penalty,

      recovery_fee:
        dto.recovery_fee,

      created_at:
        dto.created_at,

      updated_at:
        dto.updated_at,
    };
  }
}