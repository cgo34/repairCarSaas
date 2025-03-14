import { DentRepairTypeDto } from "@/@application/dtos/carRepair/DentRepairTypeDto";
import { DentRepairTypeViewModel } from "@/@presentation/types/models/carRepair/DentRepairTypeViewModel";

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