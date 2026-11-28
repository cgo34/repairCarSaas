import { AnyVoid } from "@/shared/presentation/ui/components/components"
import { BodyPartViewModel } from "@/features/carRepairSettings/presentation/models/BodyPartViewModel"
import { LineItemViewModel } from "@/features/lineItems/presentation/models/LineItemViewModel"

export type AddLineItemDialogProps = {
  availableBodyParts: BodyPartViewModel[],
}

export type AddLineItemDialogEmits = {
  (event: 'add', lineItem: LineItemViewModel): AnyVoid
  (event: 'update', lineItem: LineItemViewModel): AnyVoid
  (event: 'cancel') : void
}

export type ConfirmDialogExposed = {
  open: () => void
  close: () => void
}

