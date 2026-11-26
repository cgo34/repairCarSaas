import type { PlatformOrganizationDto } from '@/features/platformAdmin/application/dtos/PlatformOrganizationDto';

export interface IPlatformOrganizationRepository {
  list(): Promise<PlatformOrganizationDto[]>;
}
