import { SubscriptionDto } from "@/@application/dtos/SubscriptionDto";
import { SubscriptionViewModel } from "../types/models/SubscriptionViewModel";
import { SubscriptionPlanViewModel } from "../types/models/SubscriptionPlanViewModel";

export class SubscriptionMapper {
  static viewToDto(viewModel: SubscriptionViewModel): SubscriptionDto {
    return {
      ...viewModel,
      subscriptionPlan: {
        ...viewModel.subscriptionPlan
      }
    };
  }

  static dtoToView(dto: SubscriptionDto): SubscriptionViewModel {
    return {
      ...dto,
      subscriptionPlan: {
        ...dto.subscriptionPlan
      }
    };
  }
}
