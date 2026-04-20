// application/useCases/subscription/GetCurrentSubscriptionUseCase.ts

import { SubscriptionViewModel } from '@/@presentation/types/models/SubscriptionViewModel'
import { SubscriptionMapper } from '@/@presentation/mappers/SubscriptionMapper'
import { ISubscriptionRepository } from '@domain/repositories/ISubscriptionRepository'
import { ISubscriptionUseCase } from '@domain/useCases/ISubscriptionUseCase'
import { SYMBOLS } from '@infrastructure/ioc/symbols'
import { inject, injectable } from 'inversify'

@injectable()
export class GetCurrentSubscriptionUseCase implements ISubscriptionUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.SubscriptionRepository)
    private readonly repository: ISubscriptionRepository
  ) {}

  async execute(userId: string): Promise<SubscriptionViewModel> {
    const dto = await this.repository.getSubscriptionByUserId(userId);
    return SubscriptionMapper.dtoToView(dto);
  }
}
