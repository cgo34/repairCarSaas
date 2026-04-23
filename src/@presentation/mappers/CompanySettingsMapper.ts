import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';
import { CompanySettingsViewModel } from '@/@presentation/types/models/CompanySettingsViewModel';

export class CompanySettingsMapper {
  static dtoToView(dto: CompanySettingsDto): CompanySettingsViewModel {
    return {
      id: dto.id,
      userId: dto.userId,
      companyName: dto.companyName ?? '',
      legalForm: dto.legalForm ?? '',
      siren: dto.siren ?? '',
      siret: dto.siret ?? '',
      tvaNumber: dto.tvaNumber ?? '',
      capital: dto.capital ?? '',
      address: dto.address ?? '',
      zipCode: dto.zipCode ?? '',
      city: dto.city ?? '',
      country: dto.country ?? 'France',
      phone: dto.phone ?? '',
      email: dto.email ?? '',
      website: dto.website ?? '',
      iban: dto.iban ?? '',
      bic: dto.bic ?? '',
      paymentDelay: dto.paymentDelay ?? 30,
      latePaymentPenalty: dto.latePaymentPenalty ?? '',
      recoveryFee: dto.recoveryFee ?? '',
    };
  }

  static viewToDto(vm: CompanySettingsViewModel): CompanySettingsDto {
    return {
      id: vm.id,
      userId: vm.userId,
      companyName: vm.companyName,
      legalForm: vm.legalForm,
      siren: vm.siren,
      siret: vm.siret,
      tvaNumber: vm.tvaNumber,
      capital: vm.capital,
      address: vm.address,
      zipCode: vm.zipCode,
      city: vm.city,
      country: vm.country,
      phone: vm.phone,
      email: vm.email,
      website: vm.website,
      iban: vm.iban,
      bic: vm.bic,
      paymentDelay: vm.paymentDelay,
      latePaymentPenalty: vm.latePaymentPenalty,
      recoveryFee: vm.recoveryFee,
    };
  }
}
