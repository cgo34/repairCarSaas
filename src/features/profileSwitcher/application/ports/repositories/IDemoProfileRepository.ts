import type { DemoProfileContextDto, DemoProfileDto } from '@/features/profileSwitcher/application/dtos/DemoProfileDto';

export interface IDemoProfileRepository {
  list(): Promise<DemoProfileDto[]>;
  getContext(): Promise<DemoProfileContextDto | null>;
  switchTo(profileId: string): Promise<void>;
  clear(): Promise<void>;
}
