import type { IDemoProfileRepository } from '@/features/profileSwitcher/application/ports/repositories/IDemoProfileRepository';

export interface IDeleteDemoProfileUseCase {
  execute(profileId: string): Promise<void>;
}

export class DeleteDemoProfileUseCase implements IDeleteDemoProfileUseCase {
  constructor(private readonly repository: IDemoProfileRepository) {}

  execute(profileId: string): Promise<void> {
    return this.repository.delete(profileId);
  }
}
