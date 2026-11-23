import { AnyVoid } from "@/shared/presentation/ui/components/components"
import { GarageViewModel } from "@/features/garages/presentation/models/GarageViewModel"

export type GarageDialogEmits = {
  (event: 'validated', garage: GarageViewModel): AnyVoid
}

export type GarageDialogExposed = {
  open: () => void
  close: () => void
}
