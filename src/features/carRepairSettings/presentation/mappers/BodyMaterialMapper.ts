import { BodyMaterialDto } from "@/features/carRepairSettings/application/dtos/BodyMaterialDto";
import { BodyMaterialViewModel } from "@/features/carRepairSettings/presentation/models/BodyMaterialViewModel";

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