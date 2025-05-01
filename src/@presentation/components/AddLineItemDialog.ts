import { AnyVoid } from "../types/components"
import { BodyPartViewModel } from "../types/models/carRepair/BodyPartViewModel"
import { LineItemViewModel } from "../types/models/LineItemViewModel"

export type AddLineItemDialogProps = {
  availableBodyParts: BodyPartViewModel[],
}

export type AddLineItemDialogEmits = {
  (event: 'add', lineItem: LineItemViewModel): AnyVoid
  (event: 'cancel') : void
}

export type ConfirmDialogExposed = {
  open: () => void
  close: () => void
}

