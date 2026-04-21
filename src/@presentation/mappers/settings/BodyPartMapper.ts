import { BodyPartDto } from "@/@application/dtos/carRepair/BodyPartDto";
import { BodyPartViewModel } from "@/@presentation/types/models/carRepair/BodyPartViewModel";

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