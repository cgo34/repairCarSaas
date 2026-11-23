import { DocumentStatusDto } from "@/features/documentStatuses/application/dtos/DocumentStatusDto";
import { DocumentStatusViewModel } from "@/features/documentStatuses/presentation/models/DocumentStatusViewModel";

export class DocumentStatuseMapper {
  static viewToDto(viewModel: DocumentStatusViewModel): DocumentStatusDto {
    return {
      id: viewModel.id,
      code: viewModel.code,
      label: viewModel.label
    };
  }

  static dtoToView(dto: DocumentStatusDto): DocumentStatusViewModel {
    return {
      id: dto.id,
      code: dto.code,
      label: dto.label
    };
  }
}