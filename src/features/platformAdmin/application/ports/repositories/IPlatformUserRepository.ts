import type { PlatformUserDto } from '@/features/platformAdmin/application/dtos/PlatformUserDto';

export interface IPlatformUserRepository {
  list(): Promise<PlatformUserDto[]>;
}
