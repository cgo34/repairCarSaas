// application/useCases/subscription/GetCurrentSubscriptionUseCase.ts
import { SubscriptionDto } from '@domain/models/SubscriptionDto'
import { ISubscriptionRepository } from '@domain/repositories/ISubscriptionRepository'
import { SYMBOLS } from '@infrastructure/ioc/symbols'
import { inject, injectable } from 'inversify'

@injectable()
export class GetCurrentSubscriptionUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.SubscriptionRepository)
    private readonly repository: ISubscriptionRepository
  ) {}

  async execute(userId: string): Promise<SubscriptionDto | null> {
    return await this.repository.getSubscriptionByUserId(userId)
  }
}
