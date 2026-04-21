import { DocumentStatusApiModel } from "../database/api/DocumentStatusApiModel";
import { DocumentStatusDto } from "@/@application/dtos/DocumentStatusDto";


export class DocumentStatusMapper {
  static apiToDto(apiModel: DocumentStatusApiModel): DocumentStatusDto {
    return {
      id: apiModel.id,
      code: apiModel.code,
      label: apiModel.label
    };
  }

  static dtoToApi(dto: DocumentStatusDto): DocumentStatusApiModel {
    return {
      id: dto.id,
      code: dto.code,
      label: dto.label
    };
  }
}
