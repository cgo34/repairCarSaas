import { BodyPartDto } from "@/features/carRepairSettings/application/dtos/BodyPartDto";
import { BodyPartViewModel } from "@/features/carRepairSettings/presentation/models/BodyPartViewModel";

export class BodyPartMapper {
    static viewToDto(viewModel: BodyPartViewModel): BodyPartDto {
        return {
            id: viewModel.id,
            name: viewModel.name,
            code: viewModel.code,
            color: viewModel.color
        };
    }
    static dtoToView(dto: BodyPartDto): BodyPartViewModel {
        return {
            id: dto.id,
            name: dto.name,
            code: dto.code,
            color: dto.color
        };
    }
}