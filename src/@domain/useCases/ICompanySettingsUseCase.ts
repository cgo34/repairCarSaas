import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';

export interface ICompanySettingsUseCase {
  getByUserId(userId: string): Promise<CompanySettingsDto | null>;
  create(dto: CompanySettingsDto): Promise<CompanySettingsDto>;
  update(dto: CompanySettingsDto): Promise<CompanySettingsDto>;
}
