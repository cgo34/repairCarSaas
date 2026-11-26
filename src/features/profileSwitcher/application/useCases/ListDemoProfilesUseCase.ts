import type { DemoProfileDto } from '@/features/profileSwitcher/application/dtos/DemoProfileDto';
import type { IDemoProfileRepository } from '@/features/profileSwitcher/application/ports/repositories/IDemoProfileRepository';

export interface IListDemoProfilesUseCase {
  execute(): Promise<DemoProfileDto[]>;
}

export class ListDemoProfilesUseCase implements IListDemoProfilesUseCase {
  constructor(private readonly repository: IDemoProfileRepository) {}

  execute(): Promise<DemoProfileDto[]> {
    return this.repository.list();
  }
}
