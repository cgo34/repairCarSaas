export interface ISubscriptionService {
  activateFreePlanForOrganization(
    organizationId: string
  ): Promise<void>;
}