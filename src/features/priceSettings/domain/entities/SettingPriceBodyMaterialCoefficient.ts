import { BodyMaterial } from "@/features/carRepairSettings/domain/entities/BodyMaterial";

export class SettingPriceBodyMaterialCoefficient {
  constructor(
    public userId: string,
    public coefficient: number,
    public bodyMaterialId?: string,
    public bodyMaterials?: BodyMaterial
  ) {}
}
