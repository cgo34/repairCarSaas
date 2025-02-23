import { BodyPartDto } from "@/@application/dtos/carRepair/BodyPartDto";

export interface IBodyPartService {
  getAll(): Promise<BodyPartDto[]>;
  create(bodyPart: BodyPartDto): Promise<BodyPartDto>;
  update(bodyPart: BodyPartDto): Promise<BodyPartDto>;
  delete(id: string): Promise<void>;
}