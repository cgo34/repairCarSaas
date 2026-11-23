import { DentRepairTypeDto } from "@/features/carRepairSettings/application/dtos/DentRepairTypeDto";
import { DentRepairTypeViewModel } from "@/features/carRepairSettings/presentation/models/DentRepairTypeViewModel";

export class RepairTypeMapper {
    static viewToDto(viewModel: DentRepairTypeViewModel): DentRepairTypeDto {
        return {
            id: viewModel.id,
            name: viewModel.name,
            code: viewModel.code,
        };
    }
    static dtoToView(dto: DentRepairTypeDto): DentRepairTypeViewModel {
        return {
            id: dto.id,
            name: dto.name,
            code: dto.code,
        };
    }
}