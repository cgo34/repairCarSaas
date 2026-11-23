import { DentRepairTypeDto } from "@/features/carRepairSettings/application/dtos/DentRepairTypeDto";


export interface SettingPriceRepairTypeCoefficientDto {
    userId: string,
    coefficient: number
    repairTypeId?: string,
    repairTypes?: DentRepairTypeDto,
}