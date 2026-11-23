import { BodyPartDto } from "@/features/carRepairSettings/application/dtos/BodyPartDto";

export interface IBodyPartService {
  getAll(): Promise<BodyPartDto[]>;
  create(bodyPart: BodyPartDto): Promise<BodyPartDto>;
  update(bodyPart: BodyPartDto): Promise<BodyPartDto>;
  delete(id: string): Promise<void>;
}