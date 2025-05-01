export class SettingPriceImpactCountToUt {
  constructor(
    public id: string,
    public impactCountMin: number,
    public impactCountMax: number,
    public unitTime: number,
    public userId: string
  ) {}
}
