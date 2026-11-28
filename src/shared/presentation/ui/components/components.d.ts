export type AnyVoid = void | Promise<void>

export type GenericDialogExposed = {
  open: () => void
  close: () => void
}

export type AddLineItemDialogExposed = {
  open: (item?: import('@/features/lineItems/presentation/models/LineItemViewModel').LineItemViewModel, bodyPart?: import('@/features/carRepairSettings/presentation/models/BodyPartViewModel').BodyPartViewModel) => void
  close: () => void
}
