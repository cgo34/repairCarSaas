import { SubscriptionDto } from "@/features/subscription/application/dtos/SubscriptionDto";
import { SubscriptionApiModel } from "@/features/subscription/infrastructure/api/SubscriptionApiModel";


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
      includedSeats: api.included_seats,
      extraSeats: api.extra_seats,
      extraSeatPrice: Number(api.extra_seat_price),
      maxSeats: api.max_seats,
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
      included_seats: dto.includedSeats,
      extra_seats: dto.extraSeats,
      extra_seat_price: dto.extraSeatPrice,
      max_seats: dto.maxSeats,
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
