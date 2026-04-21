import { DentRepairTypeDto } from "../../carRepair/DentRepairTypeDto";


export interface SettingPriceRepairTypeCoefficientDto {
    userId: string,
    coefficient: number
    repairTypeId?: string,
    repairTypes?: DentRepairTypeDto,
}