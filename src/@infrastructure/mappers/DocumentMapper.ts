import { DocumentStatuseDto } from "@/@application/dtos/DocumentStatuseDto";
import { DocumentStatuseApiModel } from "../database/api/DocumentStatuseApiModel";


export class DocumentStatuseMapper {
  static apiToDto(apiModel: DocumentStatuseApiModel): DocumentStatuseDto {
    return {
      id: apiModel.id,
      code: apiModel.code,
      label: apiModel.label
    };
  }

  static dtoToApi(dto: DocumentStatuseDto): DocumentStatuseApiModel {
    return {
      id: dto.id,
      code: dto.code,
      label: dto.label
    };
  }
}
