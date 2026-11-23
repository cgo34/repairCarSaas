export type AnyVoid = void | Promise<void>

export type GenericDialogExposed = {
  open: () => void
  close: () => void
}

export type AddLineItemDialogExposed = {
  open: () => void
  close: () => void
}
