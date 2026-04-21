// application/useCases/subscription/GetCurrentSubscriptionUseCase.ts

import { SubscriptionDto } from '@/@application/dtos/SubscriptionDto'
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

  async execute(userId: string): Promise<SubscriptionDto> {
    return this.repository.getSubscriptionByUserId(userId);
  }
}
