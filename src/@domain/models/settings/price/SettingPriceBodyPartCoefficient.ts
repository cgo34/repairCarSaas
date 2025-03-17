import { BodyPart } from '@/@domain/models/settings/carRepair/BodyPart';

export class SettingPriceBodyPartCoefficient {
  constructor(
    public userId: string,
    public coefficient: number,
    public bodyPart?: BodyPart,
    public bodyPartId?: string,
  ) {}
}
