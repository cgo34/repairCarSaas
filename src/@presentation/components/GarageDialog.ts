import { AnyVoid } from "../types/components"
import { GarageViewModel } from "../types/models/GarageViewModel"

export type GarageDialogEmits = {
  (event: 'validated', garage: GarageViewModel): AnyVoid
}

export type GarageDialogExposed = {
  open: () => void
  close: () => void
}
