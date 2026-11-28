import type { IDemoProfileRepository } from '@/features/profileSwitcher/application/ports/repositories/IDemoProfileRepository';
import type { DemoProfileRole } from '@/features/profileSwitcher/application/dtos/DemoProfileDto';

export interface CreateDemoProfileInput {
  organizationId: string;
  role: DemoProfileRole;
  label?: string;
}

export interface ICreateDemoProfileUseCase {
  execute(input: CreateDemoProfileInput): Promise<void>;
}

export class CreateDemoProfileUseCase implements ICreateDemoProfileUseCase {
  constructor(private readonly repository: IDemoProfileRepository) {}

  execute(input: CreateDemoProfileInput): Promise<void> {
    return this.repository.create(input.organizationId, input.role, input.label);
  }
}
