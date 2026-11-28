import { SubscriptionDto } from "@/features/subscription/application/dtos/SubscriptionDto";
import { SubscriptionApiModel } from "@/features/subscription/infrastructure/api/SubscriptionApiModel";


export class SubscriptionMapper {
  /**
   * Convertit un `SubscriptionApiModel` (BDD) en `SubscriptionDto` (Application)
   */
  static apiToDto(
    api: SubscriptionApiModel,
    features: Record<string, number | boolean | null> = {},
  ): SubscriptionDto {
    const seatsLimit = features.max_seats == null ? 0 : Number(features.max_seats);
    return {
      id: api.id,
      organizationId: api.organization_id,
      planId: api.plan_id,
      stripeSubscriptionId: api.stripe_subscription_id ?? undefined,
      status: api.status,
      features,
      seatsLimit,
      startDate: api.start_date,
      endDate: api.end_date,
      createdAt: api.created_at,
      subscriptionPlan: {
        id: api.subscriptionPlan.id,
        name: api.subscriptionPlan.name,
        code: api.subscriptionPlan.code,
        description: api.subscriptionPlan.description,
        priceCents: api.subscriptionPlan.price_cents,
        stripePriceId: api.subscriptionPlan.stripe_price_id ?? undefined,
        createdAt: api.subscriptionPlan.created_at,
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
        code: dto.subscriptionPlan.code,
        description: dto.subscriptionPlan.description,
        price_cents: dto.subscriptionPlan.priceCents,
        stripe_price_id: dto.subscriptionPlan.stripePriceId ?? null,
        created_at: dto.subscriptionPlan.createdAt,
      },
    };
  }
}
