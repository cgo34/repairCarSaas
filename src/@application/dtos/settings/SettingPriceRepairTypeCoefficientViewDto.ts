import { DentRepairTypeViewDto } from "./carRepair/DentRepairViewDto"

export interface SettingPriceRepairTypeCoefficientViewDto {
    userId: string,
    coefficient: number
    repairTypeId?: string,
    repairTypes?: DentRepairTypeViewDto,
}