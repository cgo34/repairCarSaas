import { CompanySettingsDto } from '@/features/account/application/dtos/CompanySettingsDto';
import { ICompanySettingsRepository } from '@/features/account/application/ports/repositories/ICompanySettingsRepository';

export interface ICompanySettingsUseCase {
  getByUserId(userId: string): Promise<CompanySettingsDto | null>;
  create(dto: CompanySettingsDto): Promise<CompanySettingsDto>;
  update(dto: CompanySettingsDto): Promise<CompanySettingsDto>;
}

export class CompanySettingsUseCase implements ICompanySettingsUseCase {
  constructor(
    private readonly companySettingsRepository: ICompanySettingsRepository
  ) {}

  async getByUserId(userId: string): Promise<CompanySettingsDto | null> {
    return this.companySettingsRepository.getByUserId(userId);
  }

  async create(dto: CompanySettingsDto): Promise<CompanySettingsDto> {
    return this.companySettingsRepository.create(dto);
  }

  async update(dto: CompanySettingsDto): Promise<CompanySettingsDto> {
    return this.companySettingsRepository.update(dto);
  }
}
