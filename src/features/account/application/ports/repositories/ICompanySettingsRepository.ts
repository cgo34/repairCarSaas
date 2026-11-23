import { CompanySettingsDto } from '@/features/account/application/dtos/CompanySettingsDto';

export interface ICompanySettingsRepository {
  getByUserId(userId: string): Promise<CompanySettingsDto | null>;
  create(dto: CompanySettingsDto): Promise<CompanySettingsDto>;
  update(dto: CompanySettingsDto): Promise<CompanySettingsDto>;
}
