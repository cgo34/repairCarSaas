import { BodyPart } from '@/features/carRepairSettings/domain/entities/BodyPart';

export class SettingPriceBodyPartCoefficient {
  constructor(
    public userId: string,
    public coefficient: number,
    public bodyPart?: BodyPart,
    public bodyPartId?: string,
  ) {}
}
