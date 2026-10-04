export type FormProps = {
  onSubmit: () => void;
  onCancel: () => void;
  disabled: boolean;
  isCancelDisabled?: boolean;
  confirmButtonText: string;
  confirmButtonLabel: string;
  inlineActions?: boolean;
  /** `solid` paints the confirm button in full purple with white text, for a
   * form whose submit is the one call to action on screen. */
  confirmButtonFill?: 'tint' | 'solid';
  /** Takes over the submit gate from native validity, for a rule the inputs
   * do not carry themselves. */
  isValid?: boolean;
} & ChildrenProps;
