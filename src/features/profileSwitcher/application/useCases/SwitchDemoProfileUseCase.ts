import type { IDemoProfileRepository } from '@/features/profileSwitcher/application/ports/repositories/IDemoProfileRepository';

export interface ISwitchDemoProfileUseCase {
  execute(profileId: string): Promise<void>;
}

export class SwitchDemoProfileUseCase implements ISwitchDemoProfileUseCase {
  constructor(private readonly repository: IDemoProfileRepository) {}

  execute(profileId: string): Promise<void> {
    return this.repository.switchTo(profileId);
  }
}
