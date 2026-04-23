import { CompanySettingsApiModel } from '@/@infrastructure/database/api/CompanySettingsApiModel';
import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';

export class CompanySettingsMapper {
  static apiToDto(api: CompanySettingsApiModel): CompanySettingsDto {
    return {
      id: api.id,
      userId: api.user_id,
      companyName: api.company_name,
      legalForm: api.legal_form,
      siren: api.siren,
      siret: api.siret,
      tvaNumber: api.tva_number,
      capital: api.capital,
      address: api.address,
      zipCode: api.zip_code,
      city: api.city,
      country: api.country,
      phone: api.phone,
      email: api.email,
      website: api.website,
      iban: api.iban,
      bic: api.bic,
      paymentDelay: api.payment_delay,
      latePaymentPenalty: api.late_payment_penalty,
      recoveryFee: api.recovery_fee,
    };
  }

  static dtoToApi(dto: CompanySettingsDto): CompanySettingsApiModel {
    return {
      id: dto.id,
      user_id: dto.userId,
      company_name: dto.companyName,
      legal_form: dto.legalForm,
      siren: dto.siren,
      siret: dto.siret,
      tva_number: dto.tvaNumber,
      capital: dto.capital,
      address: dto.address,
      zip_code: dto.zipCode,
      city: dto.city,
      country: dto.country,
      phone: dto.phone,
      email: dto.email,
      website: dto.website,
      iban: dto.iban,
      bic: dto.bic,
      payment_delay: dto.paymentDelay,
      late_payment_penalty: dto.latePaymentPenalty,
      recovery_fee: dto.recoveryFee,
    };
  }
}
