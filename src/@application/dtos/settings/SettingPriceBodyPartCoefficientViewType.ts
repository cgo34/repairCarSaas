import { BodyPartViewDto } from "./carRepair/BodyPartViewDto";

export interface SettingPriceBodyPartCoefficientViewDto {
    userId: string,
    coefficient: number,
    bodyParts: BodyPartViewDto,
    bodyPartId: string,
}
