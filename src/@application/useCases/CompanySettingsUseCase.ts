import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';
import { ICompanySettingsRepository } from '@/@domain/repositories/ICompanySettingsRepository';
import { ICompanySettingsUseCase } from '@/@domain/useCases/ICompanySettingsUseCase';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class CompanySettingsUseCase implements ICompanySettingsUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.CompanySettingsRepository)
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
