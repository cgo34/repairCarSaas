import { DocumentStatuseDto } from "@/@application/dtos/DocumentStatuseDto";
import { DocumentStatuseViewModel } from "../types/models/DocumentStatuseViewModel";

export class DocumentStatuseMapper {
  static viewToDto(viewModel: DocumentStatuseViewModel): DocumentStatuseDto {
    return {
      id: viewModel.id,
      code: viewModel.code,
      label: viewModel.label
    };
  }

  static dtoToView(dto: DocumentStatuseDto): DocumentStatuseViewModel {
    return {
      id: dto.id,
      code: dto.code,
      label: dto.label
    };
  }
}