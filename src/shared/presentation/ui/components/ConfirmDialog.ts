//#region -> COMPONENT TYPES
export const confirmDialogTypes = ['info','warning','error','success'] as const
export type ConfirmDialogType = typeof confirmDialogTypes[number]
//#endregion

export type ConfirmDialogProps = {
  /** Message to display */
  message: string,
  /** Modal title */
  title: string,
  /** Accept button label */
  confirmLabel: string,
  /** reject button label */
  cancelLabel: string,
  /** Dialog type */
  type: ConfirmDialogType
}

export type ConfirmDialogEmits = {
  (event: 'confirm'): void,
  (event: 'cancel') : void
}

export type ConfirmDialogExposed = {
  open: () => void
  close: () => void
}

