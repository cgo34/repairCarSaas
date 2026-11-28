export type DemoProfileRole = 'admin' | 'manager' | 'technician';

export interface DemoProfileDto {
  profileId: string;
  organizationId: string;
  organizationName: string;
  planCode: string | null;
  role: DemoProfileRole;
  label: string;
}

export interface DemoProfileContextDto {
  profileId: string;
  organizationId: string;
  role: DemoProfileRole;
}
