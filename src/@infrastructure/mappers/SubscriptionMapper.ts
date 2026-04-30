import { SubscriptionDto } from "@/@application/dtos/SubscriptionDto";
import { SubscriptionApiModel } from "../database/api/SubscriptionApiModel";


export class SubscriptionMapper {
  /**
   * Convertit un `SubscriptionApiModel` (BDD) en `SubscriptionDto` (Application)
   */
  static apiToDto(api: SubscriptionApiModel): SubscriptionDto {
    return {
      id: api.id,
      organizationId: api.organization_id,
      planId: api.plan_id,
      stripeSubscriptionId: api.stripe_subscription_id ?? undefined,
      status: api.status,
      startDate: api.start_date,
      endDate: api.end_date,
      createdAt: api.created_at,
      subscriptionPlan: {
        id: api.subscriptionPlan.id,
        name: api.subscriptionPlan.name,
        description: api.subscriptionPlan.description,
        priceCents: api.subscriptionPlan.price_cents,
        stripePriceId: api.subscriptionPlan.stripe_price_id,
        createdAt: api.subscriptionPlan.createdAt,
      },
    };
  }

  /**
   * Convertit un `SubscriptionDto` (Application) en `SubscriptionApiModel` (BDD)
   */
  static dtoToApi(dto: SubscriptionDto): SubscriptionApiModel {
    return {
      id: dto.id,
      organization_id: dto.organizationId,
      plan_id: dto.planId,
      stripe_subscription_id: dto.stripeSubscriptionId ?? null,
      status: dto.status,
      start_date: dto.startDate,
      end_date: dto.endDate,
      created_at: dto.createdAt,
      subscriptionPlan: {
        id: dto.subscriptionPlan.id,
        name: dto.subscriptionPlan.name,
        description: dto.subscriptionPlan.description,
        price_cents: dto.subscriptionPlan.priceCents,
        stripe_price_id: dto.subscriptionPlan.stripePriceId,
        createdAt: dto.subscriptionPlan.createdAt,
      },
    };
  }
}
