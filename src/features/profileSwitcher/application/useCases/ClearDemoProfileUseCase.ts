import type { IDemoProfileRepository } from '@/features/profileSwitcher/application/ports/repositories/IDemoProfileRepository';

export interface IClearDemoProfileUseCase {
  execute(): Promise<void>;
}

export class ClearDemoProfileUseCase implements IClearDemoProfileUseCase {
  constructor(private readonly repository: IDemoProfileRepository) {}

  execute(): Promise<void> {
    return this.repository.clear();
  }
}
