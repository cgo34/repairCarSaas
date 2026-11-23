import { SubscriptionDto } from "@/features/subscription/application/dtos/SubscriptionDto";
import { SubscriptionViewModel } from "@/features/subscription/presentation/models/SubscriptionViewModel";

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
