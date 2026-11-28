import { translateCode } from '@/app/i18n/translateCode';

type Coded = { code?: string; name: string };

// Display labels for DB reference data, translated through their stable `code`.
export const bodyPartLabel = (item: Coded): string => translateCode('bodyParts', item.code, item.name);
export const bodyMaterialLabel = (item: Coded): string => translateCode('bodyMaterials', item.code, item.name);
export const repairTypeLabel = (item: Coded): string => translateCode('repairTypes', item.code, item.name);
