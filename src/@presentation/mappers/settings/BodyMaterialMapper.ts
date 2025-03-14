import { BodyMaterialDto } from "@/@application/dtos/carRepair/BodyMaterialDto";
import { BodyMaterialViewModel } from "@/@presentation/types/models/carRepair/BodyMaterialViewModel";

export class BodyMaterialMapper {
    static viewToDto(viewModel: BodyMaterialViewModel): BodyMaterialDto {
        return {
            id: viewModel.id,
            name: viewModel.name,
            code: viewModel.code,
        };
    }
    static dtoToView(dto: BodyMaterialDto): BodyMaterialViewModel {
        return {
            id: dto.id,
            name: dto.name,
            code: dto.code,
        };
    }
}