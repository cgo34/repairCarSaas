import type { DemoProfileContextDto, DemoProfileDto, DemoProfileRole } from '@/features/profileSwitcher/application/dtos/DemoProfileDto';

export interface IDemoProfileRepository {
  list(): Promise<DemoProfileDto[]>;
  getContext(): Promise<DemoProfileContextDto | null>;
  switchTo(profileId: string): Promise<void>;
  clear(): Promise<void>;
  create(organizationId: string, role: DemoProfileRole, label?: string): Promise<void>;
  delete(profileId: string): Promise<void>;
}
